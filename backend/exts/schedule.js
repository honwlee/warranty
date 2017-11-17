const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule();
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
    // schedule.scheduleJob('1-10 * * * * *', function() {
        let date = new Date();
        let dateF = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        fs.copy(path.join(__dirname, '../dbs'), path.join(__dirname, '../backup/dbs.' + dateF), function(err) {
            if (err) return console.error(err)
            console.log('success!')
        });
        console.log(dateF);
        console.log('scheduleCronstyle:' + new Date());
    });
}

exports.backupDb = backupDb;
