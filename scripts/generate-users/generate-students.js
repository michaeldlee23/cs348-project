/*
    This script is used for generating the `generate-students.sql` script, which is then run by 
    `reset.sql` to populate the `students` table.
    
    Run this script before running `reset.sql`. It will also generate `students-password-map.txt` which
    provides a mapping from the randomly generated emails to their plaintext passwords, usable
    for testing purposes.
*/

'use-strict';

const fs = require('fs');
const chance = require('chance')();
const bcrypt = require('bcryptjs');

const ENTITY = 'students';
const SCHEMA = '(email, password, last, first, middle, year, birthdate, phone, advisorID, scope)'
const SCOPE = 'STUDENT'
const OUTPUT = './generate-students.sql';
const PASSWORD_MAP = './password-map-students.txt';

fs.unlink(PASSWORD_MAP, (err) => {
    if (err) return console.log(err);
});

const generateRecord = async () => {
    const salt = await bcrypt.genSalt(10);
    const plaintext = chance.string({ length: 8 });
    const password = await bcrypt.hash(plaintext, salt);
    let phone = chance.phone();
    phone = phone.substr(1, 3) + '-' + phone.substr(6);
    const data = {
        email: chance.email(),
        password: password,
        last: chance.word(),
        first: chance.word(),
        middle: chance.character({ alpha: true, casing: 'upper' }),
        year: chance.integer({ min: 1, max: 5 }),
        birthdate: chance.date().toISOString().replace(/T.+/, ''),
        phone: phone,
        advisorID: chance.integer({ min: 10000, max: 10009 }),
        scope: SCOPE,
    };

    fs.appendFile(PASSWORD_MAP, `${data.email} : ${plaintext}\n`, (err) => {
        if (err) return console.log(err);
    });

    let values = ''
    Object.values(data).forEach((val) => {
        if (typeof(val) == 'string') {
            values += `,'${val}'`;
        } else {
            values += `,${val}`;
        }
    });
    return '\t(' + values.substr(1) + '),\n';
};

const generateBatch = async (sql, n) => {
    for (let i = 0; i < n; i++) {
        sql += await generateRecord();
    }
    return sql
};

const generateStudents = (n) => {
    const sql = `INSERT INTO ${ENTITY} ${SCHEMA} VALUES\n`;
    generateBatch(sql, n).then((sql) => {
        fs.writeFile(OUTPUT, (sql.substr(0, sql.length - 2) + '\n;'), (err) => {
            if (err) return console.log(err);
        });
    });
}

module.exports = generateStudents;
