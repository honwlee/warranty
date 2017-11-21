'use strict';
const Model = require("./_Base").Model,
    path = require('path'),
    fs = require('fs');

exports.Product = class Product extends Model {
    static list(sortKey = "status", direction = "asc") {
        return Model.list("products", sortKey, direction);
    }
    static findBy(args) {
        return Model.findBy("products", args);
    }
    static create(args) {
        return Model.create("products", args);
    }
    static update(args) {
        return Model.update("products", "id", args);
    }
    static delete(args) {
        return Model.delete("products", args);
    }
    static importData() {
        let products = JSON.parse(fs.readFileSync(path.join(__dirname, "../dbs/products.json"), 'utf8'));
        let results = [];
        products.forEach(function(Product) {
            results.push(Model.findOrCreate("products", "username", Product));
        });
        return results;
    }
    static exportData() {

    }
}
