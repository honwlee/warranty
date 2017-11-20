'use strict';
const Product = require('../../models/Product').Product;
const parse = require('../../exts/parseList').parse;
module.exports = {
    index: function(req, res) {
        parse("products", req, res, ["prodNumber"]);
        // res.json(Product.list());
    },

    show: function(req, res) {
        let opt = {};
        opt[req.query.key] = req.query.value;
        let product = Product.findBy(opt);
        if (product) {
            res.json(product);
        } else {
            res.json({ status: false, msg: "no results!" });
        }
    },

    update: function(req, res) {
        req.body.file = req.file;
        let product = Product.update(req.body);
        res.json(product)
    },

    create: function(req, res) {
        req.body.file = req.file;
        let product = Product.create(req.body);
        res.json(product);
        // });
    },

    delete: function(req, res) {
        Product.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    import: function(req, res) {
        res.json(Product.importData());
    }
}
