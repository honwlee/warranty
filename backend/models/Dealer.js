'use strict';
const Model = require("./_Base").Model,
    path = require('path'),
    fs = require('fs');

exports.Dealer = class Dealer extends Model {
    static list(sortKey = "status", direction = "asc") {
        return Model.list("dealers", sortKey, direction);
    }
    static findBy(args) {
        return Model.findBy("dealers", args);
    }
    static findByReg(args) {
        return Model.findByReg("dealers", args);
    }
    static create(args) {
        args.createdAt = new Date();
        args.updatedAt = new Date();
        return Model.create("dealers", args);
    }
    static update(args) {
        args.updatedAt = new Date();
        return Model.update("dealers", "id", args);
    }
    static delete(args) {
        return Model.delete("dealers", args);
    }
    static importData() {
        let dealers = JSON.parse(fs.readFileSync(path.join(__dirname, "../dbs/dealers.json"), 'utf8'));
        let results = [];
        dealers.forEach(function(dealer) {
            results.push(Model.findOrCreate("dealers", "username", dealer));
        });
        return results;
    }
    static exportData() {

    }
}
