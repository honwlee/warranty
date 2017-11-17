'use strict';
const Province = require('../../models/Province').Province,
    City = require('../../models/City').City,
    pinyin = require("node-pinyin"),
    baseUrl = "http://ube.ihudao.dt.hudaokeji.com:3000",
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

    import: function(req, res) {
        Province.delete();
        City.delete();
        request.get(baseUrl + '/ubase/api/v1/orgs/provinces?private_token=xxo8r1PT4NfEFV8az9a3', function(error, response, body) {
            JSON.parse(body).forEach(function(p) {
                let province = Province.create({
                    name: p.name,
                    enName: pinyin(p.name, {
                        style: "normal"
                    }).join(" ")
                });
                p.children.forEach(function(c) {
                    City.create({
                        name: c.name,
                        enName: pinyin(c.name, {
                            style: "normal"
                        }).join(" "),
                        provinceName: province.enName,
                        provinceId: province.id
                    });
                });
            });
            res.json({ status: true, msg: "provinces: " + Province.size() + " cities: " + City.size() });
        });

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
