/*
    This script is used for generating the `generate-advisors.sql` script, which is then run by 
    `reset.sql` to populate the `advisors` table.
    
    Run this script before running `reset.sql`. It will also generate `advisors-password-map.txt` which
    provides a mapping from the randomly generated emails to their plaintext passwords, usable
    for testing purposes.
*/

'use-strict';

const fs = require('fs');
const chance = require('chance')();
const bcrypt = require('bcryptjs');

const ENTITY = 'advisors';
const SCHEMA = '(email, password, last, first, middle, birthdate, phone, salary, scope)';
const SCOPE = 'ADVISOR';
const OUTPUT = './generate-advisors.sql';
const PASSWORD_MAP = './password-map-advisors.txt';

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
        birthdate: chance.date().toISOString().replace(/T.+/, ''),
        phone: phone,
        salary: chance.integer({ min: 50000, max: 999999 }),
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

const generateAdvisors = (n) => {
    const sql = `INSERT INTO ${ENTITY} ${SCHEMA} VALUES\n`;
    generateBatch(sql, n).then((sql) => {
        fs.writeFile(OUTPUT, (sql.substr(0, sql.length - 2) + '\n;'), (err) => {
            if (err) return console.log(err);
        });
    });
}

module.exports = generateAdvisors;
