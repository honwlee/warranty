'use strict';
const Model = require("./_Base").Model,
    bcrypt = require('bcryptjs'),
    path = require('path'),
    fs = require('fs');

exports.User = class User extends Model {
    static list(sortKey = "username") {
        return Model.list("users", sortKey);
    }
    static userList() {
        return Model.list("users").filter(function(arr) {
            return arr.role < 10;
        });
    }
    static findBy(args) {
        return Model.findBy("users", args);
    }
    static create(args) {
        args.role = 1;
        args.isActive = false;
        return Model.create("users", args);
    }
    static update(args) {
        if (args.password) {
            args.password = bcrypt.hashSync(args.password, 8);
        }
        return Model.update("users", "id", args);
    }
    static createAdmin() {
        let opt = {
            "display": "admin",
            "username": "admin",
            "password": "2017-123456",
            "isAdmin": true,
            "isSuperAdmin": true,
            "isActive": true
        }
        let result = Model.findBy("users", {
            username: "admin"
        });
        if(!result) {
            opt.password = bcrypt.hashSync(opt.password, 8);
            result = Model.create("users", opt);
        }
        return result;
    }
    static delete(args) {
        return Model.delete("users", args);
    }
}
