'use strict';
const ctrls = require("../controllers/admin/controllers"),
    path = require("path"),
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(__dirname, '../../src/assets/images/upload/'));
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now())
        }
    }),
    upload = multer({ storage: storage });
module.exports = function(app, ensureAuthenticated) {
    // admin
    Object.keys(ctrls).forEach(function(key) {
        ["update", "create", "show", "delete", "index"].forEach(function(name) {
            let method;
            let action;
            let matcher = name.match(/^(show|index)/)
            if (matcher) {
                method = "get";
                action = matcher[0];
                app[method]('/admin/' + key + '/' + name, function(req, res) {
                    ctrls[key][action](req, res);
                });
            } else {
                action = name;
                method = "post";
                app[method]('/admin/' + key + '/' + name, upload.single('thumbnail'), function(req, res) {
                    ctrls[key][action](req, res);
                });
            }
        });
    });
};
