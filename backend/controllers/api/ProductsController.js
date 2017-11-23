'use strict';
const Product = require('../../models/Product').Product;
const parse = require('../../exts/parseList').parse;
const validate = require('../../exts/validation').validate;
module.exports = {
    index: function(req, res) {
        parse("products", req, res, ["productRoll"]);
    },

    show: function(req, res) {
        let opt = {};
        opt[req.query.key] = req.query.value;
        let product = Product.findByReg(opt);
        if (product) {
            res.json(product);
        } else {
            res.json({ status: false, msg: "no results!" });
        }
    },

    update: function(req, res) {
        req.body.file = req.file;
        let product = Product.update(req.body);
        res.json({ status: true, result: product });
    },

    create: function(req, res) {
        req.body.file = req.file;
        validate(Product, { productRoll: req.body.productRoll }, req, res);
    },

    delete: function(req, res) {
        Product.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    import: function(req, res) {
        res.json(Product.importData());
    }
}
