'use strict';
const Warranty = require('../../models/Warranty').Warranty;
const parse = require('../../exts/parseList').parse;
const validate = require('../../exts/validation').validate;
module.exports = {
    index: function(req, res) {
        parse("warranties", req, res, ["warrantyID", "licensePlate"]);
    },

    show: function(req, res) {
        let opt = {};
        opt[req.query.key] = req.query.value;
        let warranty = Warranty.findByReg(opt);
        if (warranty) {
            res.json(warranty);
        } else {
            res.json({ status: false, msg: "no results!" });
        }
    },

    update: function(req, res) {
        req.body.file = req.file;
        // if (req.body.override) {
        // delete req.body.override;
        let warranty = Warranty.update(req.body);
        res.json({ status: true, result: warranty });
        // } else {
        //     validate(Warranty, {
        //         warrantyID: req.body.warrantyID,
        //         // licensePlate: req.body.licensePlate
        //     }, req, res, "update");
        // }
    },

    create: function(req, res) {
        req.body.file = req.file;
        validate(Warranty, {
            warrantyID: req.body.warrantyID,
            // licensePlate: req.body.licensePlate
        }, req, res);
    },

    delete: function(req, res) {
        Warranty.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    import: function(req, res) {
        res.json(Warranty.importData());
    }
}