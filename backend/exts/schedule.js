const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule();
const copydir = require('copy-dir');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require("fs-extra");


// function scheduleRecurrenceRule(){

//     let rule = new schedule.RecurrenceRule();
//     // rule.dayOfWeek = 2;
//     // rule.month = 3;
//     // rule.dayOfMonth = 1;
//     // rule.hour = 1;
//     // rule.minute = 42;
//     rule.second = 0;

//     schedule.scheduleJob(rule, function(){
//        console.log('scheduleRecurrenceRule:' + new Date());
//     });

// }

// scheduleRecurrenceRule();

function backupDb() {
    // 每天凌晨1点30备份数据
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(1, 6)];
    rule.hour = 1;
    rule.minute = 30;
    rule.second = 0;

    schedule.scheduleJob(rule, function() {
        //schedule.scheduleJob('1-10 * * * * *', function() {
        let date = new Date();

        let dateF = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2);
        let backupPath = path.join(__dirname, '../../backup');
        console.log("备份文件只保留最近6条数据");
        fs.readdir(backupPath, function(err, files) {
            files.filter(function(f) {
                return f.match(/\d+/);
            }).sort(function(a, b) {
                return a < b ? 1 : -1;
            }).forEach(function(file, index) {
                if (index > 5) {
                    let dp = path.join(backupPath, file);
                    if (fs.existsSync(dp)) {
                        rimraf.sync(dp);
                    }
                }
            });
        });
        let bp = path.join(backupPath, dateF);
        mkdirp.sync(bp + "/dbs");
        mkdirp.sync(bp + "/public");
        console.log(path.join(__dirname, '../dbs'));
        console.log(path.join(__dirname, '../../public'));

        copydir.sync(path.join(__dirname, '../dbs'), path.join(bp, "dbs"));
        copydir.sync(path.join(__dirname, '../../public'), path.join(bp, "public"));
        console.log(dateF);
        console.log('scheduleCronstyle:' + new Date());
    });
}

exports.backupDb = backupDb;