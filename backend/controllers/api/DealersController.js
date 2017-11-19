'use strict';
const Dealer = require('../../models/Dealer').Dealer;
module.exports = {
    index: function(req, res) {
        res.json(Dealer.list(req.query.sort).filter(function(d) {
            return d.cityId == req.query.cityId;
        }));
    },

    show: function(req, res) {
        let opt = {};
        opt[req.query.key] = req.query.value;
        let dealer = Dealer.findBy(opt);
        if (dealer) {
            res.json(dealer);
        } else {
            res.json({ status: false, msg: "no results!" });
        }
    },

    update: function(req, res) {
        req.body.file = req.file;
        let dealer = Dealer.update(req.body);
        if (dealer) {
            res.json(dealer)
        } else {
            res.json({ status: false, msg: "no results!" });
        }
    },

    create: function(req, res) {
        req.body.file = req.file;
        let dealer = Dealer.create(req.body);
        res.json(dealer)
    },

    delete: function(req, res) {
        Dealer.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    import: function(req, res) {
        res.json(Dealer.importData());
    }
}
