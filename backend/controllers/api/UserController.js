'use strict';
const User = require('../../models/User').User;
const request = require('request');
const baseUrl = "http://backend.ihudao.dt.hudaokeji.com";
module.exports = {
    index: function(req, res) {
        res.json(User.userList());
    },

    show: function(req, res) {
        if (req.query.uname) {
            var user = User.findBy({ username: req.query.uname });
            if (user) {
                var contact = Contact.findBy({ username: user.display });
                user.contact = contact;
                res.json({ status: true, user: user });
            } else {
                res.json({ status: false });
            }
        }
    },

    update: function(req, res) {
        let userOpts = {
            id: req.body.id
        };
        let action = req.body._action;
        delete req.body._action;
        if (action == "password") {
            let password = req.body.password || "224-123456";
            userOpts.passwordInited = password == "224-123456";
            userOpts.password = password;
            let user = User.update(userOpts);
            request.post({
                url: baseUrl + '/api/v1/bloom/rest_password',
                form: {
                    password: password,
                    username: user.username,
                }
            }, function(error, response, body) {
                res.json(user);
            });
        } else {
            switch (action) {
                case "active":
                    userOpts.isActive = true;
                    break;
                case "unActive":
                    userOpts.isActive = false;
                    break;
                case "role-normal":
                    userOpts.isAdmin = false;
                    userOpts.role = 1;
                    break;
                case "role-admin":
                    userOpts.isAdmin = true;
                    userOpts.role = 9;
                    break;
                default:
                    userOpts = req.body;
                    break;
            }
            let user = User.update(userOpts);
            res.json(user)
        }
    },

    create: function(req) {
        let user = User.create(req.body);
        res.json(user)
    },

    createAdmin: function(req, res) {
        let user = User.createAdmin();
        res.json({});
    },

    delete: function() {

    }
}
