'use strict';
const Model = require("./_Base").Model,
    path = require('path'),
    fs = require('fs');

exports.Province = class Province extends Model {
    static list(sortKey = "status", direction = "asc") {
        return Model.list("provinces", sortKey, direction);
    }
    static findBy(args) {
        return Model.findBy("provinces", args);
    }
    static create(args) {
        return Model.create("provinces", args);
    }
    static update(args) {
        return Model.update("provinces", "id", args);
    }
    static delete(args) {
        return Model.delete("provinces", args);
    }
    static size() {
        return Model.size("provinces");
    }
    static importData() {
        let provinces = JSON.parse(fs.readFileSync(path.join(__dirname, "../dbs/provinces.json"), 'utf8'));
        let results = [];
        provinces.forEach(function(province) {
            results.push(Model.findOrCreate("provinces", "enName", province));
        });
        return results;
    }
    static exportData() {

    }
}
