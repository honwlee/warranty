'use strict';
const Product = require('../../models/Product').Product;
module.exports = {
    index: function(req, res) {
        res.json(Product.list());
    },

    show: function(req, res) {
        let opt = {};
        opt[req.query.key] = req.query.value;
        let product = Product.findBy(opt);
        res.json(product);
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
