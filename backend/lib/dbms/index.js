'use strict';


var _ = require('lodash');
var _db = require('underscore-db');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var validateData = require('./validate');
var mixins = require('./mixins');

module.exports = function jsonbase(directory, opts = {}) {
    opts.master_file_name = opts.master_file_name || "master.json";

    var masterFilePath = directory + "/" + opts.master_file_name,
        spaces = {

        },
        tablespaces = {

        },
        db = {};

    function openTableSpace(jsonFilePath) {
        var adapter = new FileSync(jsonFilePath),
            space = low(adapter);

        validateData(space.getState());

        // Add underscore-db methods to db
        space._.mixin(_db);

        // Add specific mixins
        space._.mixin(mixins);

        space.forEach(function(value, key) {
            tablespaces[key] = space;
        }).value();

        return space;
    }

    var masterSpace = openTableSpace(masterFilePath),
        tables = masterSpace.get("tables");

    function ensureSpace(tableName) {
        var space = tablespaces[tableName];
        if (!space) {
            var meta = tables.find({
                name: tableName
            }).value();
            if (meta) {
                space = spaces[meta.spaceFileName];
                if (!space) {
                    space = spaces[meta.spaceFileName] = openTableSpace(directory + "/" + meta.spaceFileName);
                }
            }
        }
        return space;
    }

    db.get = function(tableName) {
        var space = ensureSpace(tableName);
        return space && space.get(tableName);
    };

    db.has = function(tableName) {
        var space = tablespaces[tableName];
        return !!space;
    };

    db.set = function(tableName, data) {
        var space = ensureSpace(tableName);
        if (space) {
            space.set(tableName, data);
        }
        return this;
    };

    db.push = function(tableName, data) {
        return this.get(tableName).push(data).write();
    };

    db.create = function(tableName, options) {
        var space = ensureSpace(tableName);
        if (!space) {
            options.spaceFileName = options.spaceFileName || tableName + ".json";
            tables.insert({
                name: tableName,
                spaceFileName: options.spaceFileName
            }).value();
            space = ensureSpace(tableName);
        }

        return space;
    };

    db.drop = function(tableName) {
        //TODO
    }

    return db;
}
