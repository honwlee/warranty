'use strict';
const ctrls = require("../controllers/api/controllers"),
    path = require("path"),
    fs = require('fs'),
    dbpath = path.join(__dirname, "../dbs"),
    jsonServer = require('../lib/restsrv/'),
    // bodyParser = require('./lib/restsrv/body-parser');
    plural = require('../lib/restsrv/router/plural'),
    nested = require('../lib/restsrv/router/nested'),
    dbms = require('../lib/dbms/'),
    jsondb = dbms(dbpath, {
        master_file_name: "master.json"
    }),
    _ = require('lodash'),
    User = require('../models/User').User,
    multer = require('multer');

module.exports = function(app, router, ensureAuthenticated, rootPath) {
    // api
    let storage = multer.diskStorage({
            destination: function(req, file, cb) {
                let _p = path.join(rootPath, 'upload');
                if (!fs.existsSync(_p)) fs.mkdirSync(_p);
                cb(null, _p);
            },
            filename: function(req, file, cb) {
                // cb(null, file.fieldname + '-' + Date.now())
                cb(null, Date.now() + "-" + file.originalname);
            }
        }),
        upload = multer({ storage: storage });
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
    app.get('/api/dealers/list', function(req, res) {
        ctrls.dealers.list(req, res);
    });
    // router.use("/lala", function(req, res) {
    //     res.json({
    //         la: "laal"
    //     })
    // });
    // router.use("/api/rest/warranties", plural(jsondb, "warranties"));
    // router.use("/api/rest/products", plural(jsondb, "products"));
    // router.use("/api/rest/dealers", plural(jsondb, "dealers"));

    app.get('/api/system/check', function(req, res) {
        res.json({ checked: User.delay(true, true) });
    });

    app.get('/api/auth/check', function(req, res) {
        if (req.isAuthenticated()) {
            res.json({ status: true, auth: true });
        } else {
            res.json({ status: false, auth: true });
        }
    });
};