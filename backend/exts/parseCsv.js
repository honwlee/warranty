const csv = require('csvtojson')
const path = require('path')
const fs = require('fs')
const contacts = []
// fs.readFile(path.join(__dirname, 'src/dbs/contacts.csv'), (err, data) => {
// if (err) throw err;
csv({ noheader: true })
    .fromFile(path.join(__dirname, 'src/dbs/contacts.csv'))
    .on('json', (json) => { //this func will be called 3 times
        contacts.push({
            username: json.field2,
            birthday: json.field3,
            address: json.field4,
            job: json.field5,
            jobAddress: json.field6,
            mobile: json.field7,
            status: json.field8
        });
    })
    .on('done', () => {
        fs.writeFile(path.join(__dirname, 'src/dbs/contacts.json'), JSON.stringify(contacts), 'utf8', (err) => {
            if (err) throw err;
            console.log('contacts data saved!');
        });
    })
// })
