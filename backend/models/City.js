'use strict';
const Model = require("./_Base").Model,
    path = require('path'),
    fs = require('fs');

exports.City = class City extends Model {
    static list(sortKey = "enName") {
        return Model.list("cities", sortKey);
    }
    static findBy(args) {
        return Model.findBy("cities", args);
    }
    static create(args) {
        return Model.create("cities", args);
    }
    static update(args) {
        return Model.update("cities", "id", args);
    }
    static delete(args) {
        return Model.delete("cities", args);
    }
    static size() {
        return Model.size("cities");
    }
    static importData() {
        let cities = JSON.parse(fs.readFileSync(path.join(__dirname, "../dbs/cities.json"), 'utf8'));
        let results = [];
        cities.forEach(function(city) {
            results.push(Model.findOrCreate("cities", "enName", city));
        });
        return results;
    }
    static exportData() {

    }
}
