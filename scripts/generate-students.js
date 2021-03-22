const fs = require('fs');
const chance = require('chance')();
const bcrypt = require('bcryptjs');

const OUTPUT = './generate-students.sql';
const PASSWORD_MAP = './password-map.txt';
const NUM_TO_GENERATE = 10;

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
        birthdate: chance.date().toISOString().replace(/\T.+/, ''),
        phone: phone,
        scope: 'STUDENT'
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

const generateBatch = async (n) => {
    for (let i = 0; i < n; i++) {
        sql += await generateRecord();
    }
    return sql
};

let sql = 'INSERT INTO students (email, password, last, first, middle, year, birthdate, phone, scope) VALUES\n';
generateBatch(NUM_TO_GENERATE).then((sql) => {
    fs.writeFile(OUTPUT, (sql.substr(0, sql.length - 2) + '\n;'), (err) => {
        if (err) return console.log(err);
    });
});

