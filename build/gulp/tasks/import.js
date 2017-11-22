'use strict';
const gulp = require('gulp'),
    gutil = require('gulp-util'),
    util = require('../utils'),
    del = require('del'),
    argv = require('yargs').argv,
    User = require('../../../backend/models/User').User,
    Province = require('../../../backend/models/Province').Province,
    City = require('../../../backend/models/City').City,
    hanzi = require("hanzi"),
    _ = require("lodash"),
    provincesJson = require('../../../backend/data/provinces.json'),
    usersJson = require('../../../backend/data/users.json'),
    request = require('request'),
    json2xls = require('json2xls');

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

function importProvinces() {
    hanzi.start();
    Province.delete();
    City.delete();
    provincesJson.forEach(function(p) {
        let pr = getName(p.name),
            province = Province.create({
                name: p.name,
                traditional: pr.traditional,
                definition: pr.definition,
                tonePinyin: pr.tonePinyin,
                pinyin: pr.pinyin
            });
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
        });
    });
};

function importUser() {
    usersJson.forEach(function(u) {
        let user = User.findOrCreate(u);
        console.log(user.username);
    });
}
module.exports = function() {
    switch (argv.type) {
        case "user":
            importUser();
            break;
        case "provinces":
            importProvinces();
            break;
        default:
            importProvinces();
            importUser();
            break;
    }
};
