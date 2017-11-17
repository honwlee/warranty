'use strict';
const ctrls = require("../controllers/api/controllers"),
    path = require("path"),
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(__dirname, '../../src/assets/images/upload/'));
        },
        filename: function(req, file, cb) {
            // cb(null, file.fieldname + '-' + Date.now())
            cb(null, Date.now() + "-" + file.originalname);
        }
    }),
    upload = multer({ storage: storage });
module.exports = function(app, ensureAuthenticated) {
    // api
    Object.keys(ctrls).forEach(function(key) {
        ["update", "create", "show", "delete", "index"].forEach(function(name) {
            let method;
            let action;
            let matcher = name.match(/^(show|index)/)
            if (matcher) {
                method = "get";
                action = matcher[0];
                app[method]('/api/' + key + '/' + name, function(req, res) {
                    ctrls[key][action](req, res);
                });
            } else {
                action = name;
                method = "post";
                app[method]('/api/' + key + '/' + name, ensureAuthenticated, upload.single('thumbnail'), function(req, res) {
                    ctrls[key][action](req, res);
                });
            }
        });
    });
    // app.get('/api/provinces/import', ensureAuthenticated, function(req, res) {
    app.get('/api/provinces/import', ensureAuthenticated, function(req, res) {
        ctrls.provinces.import(req, res);
    });

    app.get('/api/auth/check', function(req, res) {
        if (req.isAuthenticated()) {
            res.json({ status: true });
        } else {
            res.json({ status: false });
        }
    });
};
