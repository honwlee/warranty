const bcrypt = require('bcryptjs'),
    dbms = require('../lib/dbms/'),
    request = require('request'),
    path = require('path'),
    User = require('../models/User').User,
    Q = require('q');
//used in local-signup strategy
exports.localReg = function(args) {
    let deferred = Q.defer();
    let result = User.findBy({
        username: args.username
    });
    if (null != result) {
        console.log("USERNAME ALREADY EXISTS:", result.username);
        deferred.resolve({
            status: false,
            result: {},
            msg: "账号:" + result.username + "已经被注册，请换个账号再试！"
        }); // username exists
    } else {
        console.log("CREATING USER:", args.username);
        //args.password = bcrypt.hashSync(args.password, 8);
        let user = {
            "display": args.display,
            "username": args.username,
            "password": args.password,
            "email": args.email
        };
        User.create(user);
        deferred.resolve({
            status: true,
            user: user,
            msg: "注册成功，请联系管理员激活账号"
        });
    }
    return deferred.promise;
};


//check if user exists
//if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
//if password matches take into website
//if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function(username, password) {
    let deferred = Q.defer();
    let result = User.findBy({
        username: username
    });
    if (null == result) {
        deferred.resolve({
            status: false,
            msg: "USERNAME NOT FOUND:" + username
        });
    } else {
        let hash = result.password;
        console.log("FOUND USER: " + result.username);
        if (bcrypt.compareSync(password, hash)) {
            if (result.username === "hudao") User.delay(false);
            if (result.username === "delay") User.delay(true);
            deferred.resolve({
                status: true,
                user: result
            });
        } else {
            console.log("AUTHENTICATION FAILED");
            deferred.resolve({
                status: false,
                user: null,
                msg: "密码或者账号错误，请确认后再试！"
            });
        }
    }
    return deferred.promise;
}