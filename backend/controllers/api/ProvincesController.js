'use strict';
const Province = require('../../models/Province').Province,
    City = require('../../models/City').City,
    hanzi = require("hanzi"),
    _ = require("lodash"),
    baseUrl = "http://ube.ihudao.dt.hudaokeji.com:3000",
    request = require('request'),
    json2xls = require('json2xls');
hanzi.start();

function getName(name) {
    console.log(name);
    console.log("@@@@@@@@@@@@@");
    let result = hanzi.definitionLookup(name);
    console.log(result);
    if (result) {
        result = result[0];
        return {
            traditional: result.traditional,
            pinyin: _.camelCase(result.pinyin.replace(/\d/g, '')),
            tonePinyin: result.pinyin,
            definition: result.definition
        }
    } else {
        return {};
    }
};

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
        try {
            // Province.delete();
            // City.delete();
            let pResults = [],
                cResults = [];
            request.get(baseUrl + '/ubase/api/v1/orgs/provinces?private_token=xxo8r1PT4NfEFV8az9a3', function(error, response, body) {
                JSON.parse(body).forEach(function(p) {
                    let pr = getName(p.name),
                        province = Province.create({
                            name: p.name,
                            traditional: pr.traditional,
                            definition: pr.definition,
                            tonePinyin: pr.tonePinyin,
                            pinyin: pr.pinyin
                        });
                    pResults.push(pr);
                    p.children.forEach(function(c) {
                        let cr = getName(c.name);
                        City.create({
                            name: c.name,
                            traditional: cr.traditional,
                            definition: cr.definition,
                            tonePinyin: cr.tonePinyin,
                            pinyin: cr.pinyin,
                            provinceName: province.pinyin,
                            provinceId: province.id
                        });
                        cResults.push(getName(c.name))
                    });
                });
                res.json({ provinces: pResults, cities: cResults });
            });
        } catch (error) {
            res.json({ status: false, msg: error });
            throw error;
        }
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
