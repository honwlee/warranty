'use strict';
const path = require('path'),
    dbpath = path.join(__dirname, "../dbs"),
    Q = require('q'),
    fs = require('fs'),
    dbms = require('../lib/dbms/'),
    request = require('request'),
    jsondb = dbms(dbpath, {
        master_file_name: "master.json"
    }),
    shortid = require('shortid'),
    refresh = function() {
        jsondb = dbms(dbpath, {
            master_file_name: "master.json"
        });
    };
//used in local-signup strategy
class Model {
    constructor() {
        this.name = "";
    }
    static refresh() {
        refresh();
    }
    static list(name, sortKey = "id", direction = "asc") {
        let results = jsondb.get(name).sortBy(sortKey).value();
        if (direction == "desc") results = results.reverse();
        return results;

    }
    static first(name) {
        return jsondb.get(name).first().value();
    }
    static last(name) {
        return jsondb.get(name).last().value();
    }
    static findBy(name, args) {
        return jsondb.get(name).find(args).value();
    }
    static create(name, args) {
        args.id = shortid.generate();
        if (args.file && args.file.path) {
            args.file.path = args.file.path.replace(path.join(__dirname, "../../src"), "");
        }
        let result = jsondb.get(name).push(args).last().write();
        return result;
    }
    static findOrCreate(name, key, args) {
        let query = {};
        query[key] = args.key;
        let result = jsondb.get(name).find(query).value();
        if (!result) {
            if (args.file && args.file.path) {
                args.file.path = args.file.path.replace(path.join(__dirname, "../../src"), "");
            }
            result = Model.create(name, args);
        }
        return result;
    }
    static update(name, queryKey, args) {
        let opt = {};
        opt[queryKey] = args[queryKey];
        let result = jsondb.get(name).find(opt);
        if (args.file && args.file.path) {
            let file = result.value().file;
            if (file && file.path) {
                let fPath = path.join(__dirname, "../../src", file.path);
                if (fs.existsSync(fPath)) fs.unlinkSync(fPath);
            }
            args.file.path = args.file.path.replace(path.join(__dirname, "../../src"), "");
        }
        result.assign(args).write();
        return result;
    }
    static delete(name, args = {}) {
        let result = jsondb.get(name).find(args),
            file = result.value().file;
        if (file && file.path) {
            let fPath = path.join(__dirname, "../../src", file.path);
            if (fs.existsSync(fPath)) fs.unlinkSync(fPath);
        }
        result = jsondb.get(name).remove(args).write();
        return result;
    }
    static size(name) {
        let result = jsondb.get(name).size().value();
        return result;
    }
};
exports.Model = Model;
