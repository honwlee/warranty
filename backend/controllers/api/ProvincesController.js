'use strict';
const Province = require('../../models/Province').Province,
    City = require('../../models/City').City,
    request = require('request'),
    json2xls = require('json2xls');

module.exports = {
    index: function(req, res) {
        res.json(Province.list(req.query.sort, req.query.direction));
    },

    show: function(req, res) {
        let province = Province.findBy({ id: req.query.id });
        res.json(province);
    },

    update: function(req, res) {
        let province;
        if (req.body.id) {
            province = Province.update(req.body);
        } else {
            province = Province.create(req.body);
        }
        res.json(province)
    },

    create: function() {
        let province = Province.create(req.body);
        res.json(province)
    },

    delete: function(req, res) {
        Province.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    download: function(req, res) {
        let xls = json2xls(Province.list().map(function(province) {
            return {
                "name": province.name,
                "enName": province.enName,
            };
        }));
        res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-disposition': 'attachment;filename=province.xlsx',
            'Content-Length': xls.length
        });
        res.end(new Buffer(xls, 'binary'));
    }
}
