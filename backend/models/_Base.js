'use strict';
const path = require('path'),
    dbpath = path.join(__dirname, "../dbs"),
    Q = require('q'),
    fs = require('fs'),
    request = require('request'),
    dbms = require('../lib/dbms/'),
    jsondb = dbms(dbpath, {
        master_file_name: "master.json"
    }),
    shortid = require('shortid'),
    refresh = function() {
        jsondb = dbms(dbpath, {
            master_file_name: "master.json"
        });
    },
    relacedPath = path.join(__dirname, "../../public");
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
    static findAll(name, args) {
        return jsondb.get(name).filter(function(r) {
            let result = true;
            for (let key in args) {
                result = result && r[key] == args[key];
            }
            return result;
        }).value();
    }
    static findByReg(name, args) {
        return jsondb.get(name).filter(function(r) {
            let result = true;
            for (let key in args) {
                let reg = new RegExp(args[key], "i");
                result = result && r[key].length == args[key].length && r[key].match(reg);
            }
            return result;
        }).value();
    }

    static create(name, args) {
        args.id = shortid.generate();
        args.createdAt = new Date();
        args.updatedAt = new Date();
        if (args.file && args.file.path) {
            args.file.path = args.file.path.replace(relacedPath, "");
        }
        let result = jsondb.get(name).push(args).last().write();
        return result;
    }
    static findOrCreate(name, key, args) {
        let query = {};
        query[key] = args[key];
        let result = jsondb.get(name).find(query).value();
        if (!result) {
            args.id = shortid.generate();
            args.createdAt = new Date();
            args.updatedAt = new Date();
            if (args.file && args.file.path) {
                args.file.path = args.file.path.replace(relacedPath, "");
            }
            result = Model.create(name, args);
        }
        return result;
    }
    static update(name, queryKey, args) {
        let opt = {};
        opt[queryKey] = args[queryKey];
        args.updatedAt = new Date();
        let result = jsondb.get(name).find(opt);
        if (args.file && args.file.path) {
            let file = result.value().file;
            if (file && file.path) {
                let fPath = path.join(relacedPath, file.path);
                if (fs.existsSync(fPath)) fs.unlinkSync(fPath);
            }
            args.file.path = args.file.path.replace(relacedPath, "");
        } else {
            args.file = result.value().file;
        }
        result.assign(args).write();
        return result;
    }
    static delete(name, args = {}) {
        let result = jsondb.get(name).find(args);
        if (result.value()) {
            let file = result.value().file;
            if (file && file.path) {
                let fPath = path.join(relacedPath, file.path);
                if (fs.existsSync(fPath)) fs.unlinkSync(fPath);
            }
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