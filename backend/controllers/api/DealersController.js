'use strict';
const Dealer = require('../../models/Dealer').Dealer;
const parse = require('../../exts/parseList').parse;
const validate = require('../../exts/validation').validate;
module.exports = {
    index: function(req, res) {
        parse("dealers", req, res, ["company"]);
    },

    list: function(req, res) {
        let dealers;
        if (req.query.cityId) {
            dealers = Dealer.findAll({ cityId: req.query.cityId });
        } else {
            dealers = Dealer.list(req.query.sort);
        }
        if (dealers) {
            res.json(dealers);
        } else {
            res.json({ status: false, msg: "no results!" });
        }
    },

    show: function(req, res) {
        let opt = {};
        opt[req.query.key] = req.query.value;
        let dealer = Dealer.findByReg(opt);
        if (dealer) {
            res.json(dealer);
        } else {
            res.json({ status: false, msg: "no results!" });
        }
    },

    update: function(req, res) {
        req.body.file = req.file;
        // if (req.body.override) {
        // delete req.body.override;
        let dealer = Dealer.update(req.body);
        res.json({ status: true, result: dealer });
        // } else {
        // validate(Dealer, { company: req.body.company }, req, res, "update");
        // }
    },

    create: function(req, res) {
        req.body.file = req.file;
        validate(Dealer, { company: req.body.company }, req, res);
    },

    delete: function(req, res) {
        Dealer.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    import: function(req, res) {
        res.json(Dealer.importData());
    }
}