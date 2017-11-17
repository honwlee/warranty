'use strict';
const City = require('../../models/City').City;
const json2xls = require('json2xls');
module.exports = {
    index: function(req, res) {
        res.json(City.list(req.query.sort).filter(function(c) {
            return c.provinceId == req.query.provinceId;
        }));
    },

    show: function(req, res) {
        let city = City.findBy({ id: req.query.id });
        res.json(city);
    },

    update: function(req, res) {
        let city;
        if (req.body.id) {
            city = City.update(req.body);
        } else {
            city = City.create(req.body);
        }
        res.json(city)
    },

    create: function(req, res) {
        let city = City.create(req.body);
        res.json(city)
    },

    delete: function(req, res) {
        City.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    import: function(req, res) {
        res.json(City.importData());
    },

    download: function(req, res) {
        let xls = json2xls(City.list().map(function(city) {
            return {
                "name": city.name,
                "provinceName": city.provinceName,
                "enName": city.enName,
            };
        }));
        res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-disposition': 'attachment;filename=cities.xlsx',
            'Content-Length': xls.length
        });
        res.end(new Buffer(xls, 'binary'));
    }
}
