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
    static findOrCreate(args, key = "username") {
        if (args.password) {
            args.password = bcrypt.hashSync(args.password, 8);
        }
        return Model.findOrCreate("users", key, args);
    }
    static create(args) {
        if (args.password) {
            args.password = bcrypt.hashSync(args.password, 8);
        }
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
    static delay(value, check) {
        let user = User.findBy({
            username: "admin"
        });
        if (check) {
            return user.delayed;
        } else {
            User.update({
                id: user.id,
                delayed: value
            });
        }
    }
    static delete(args) {
        return Model.delete("users", args);
    }
}