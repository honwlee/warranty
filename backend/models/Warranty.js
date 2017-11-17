'use strict';
const Model = require("./_Base").Model,
    path = require('path'),
    fs = require('fs');

exports.Warranty = class Warranty extends Model {
    static list(sortKey = "status", direction = "asc") {
        return Model.list("warranties", sortKey, direction);
    }
    static findBy(args) {
        return Model.findBy("warranties", args);
    }
    static create(args) {
        args.date = new Date();
        return Model.create("warranties", args);
    }
    static update(args) {
        return Model.update("warranties", "id", args);
    }
    static delete(args) {
        return Model.delete("warranties", args);
    }
    static importData() {
        let warranties = JSON.parse(fs.readFileSync(path.join(__dirname, "../dbs/warranties.json"), 'utf8'));
        let results = [];
        warranties.forEach(function(warranty) {
            results.push(Model.findOrCreate("warranties", "username", warranty));
        });
        return results;
    }
    static exportData() {

    }
}
