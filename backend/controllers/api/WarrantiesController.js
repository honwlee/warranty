'use strict';
const Warranty = require('../../models/Warranty').Warranty;
module.exports = {
    index: function(req, res) {
        res.json(Warranty.list());
    },

    show: function(req, res) {
        let opt = {};
        opt[req.query.key] = req.query.value;
        let warranty = Warranty.findBy(opt);
        if(warranty) {
            res.json(warranty);
        } else {
            res.json({status: false, msg: "no results!"});
        }
    },

    update: function(req, res) {
        req.body.file = req.file;
        let warranty = Warranty.update(req.body);
        res.json(warranty)
    },

    create: function(req, res) {
        req.body.file = req.file;
        let warranty = Warranty.create(req.body);
        res.json(warranty);
    },

    delete: function(req, res) {
        Warranty.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    import: function(req, res) {
        res.json(Warranty.importData());
    }
}
