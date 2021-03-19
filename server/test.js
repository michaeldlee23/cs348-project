'use strict';

const mysql = require('mysql');
const info = require('../env/cred');
const Student = require('./classes/student');

const connection = mysql.createConnection(info);

connection.connect(async (err) => {
    if (err) {
        return console.error('Error: ' + err.message);
    }
    console.log('Connected!');
});

// Basic query
const simpleQuery = async () => {
    const query = "SELECT * FROM students";
    connection.query(query, async (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(results);
    });
};

// Read into object
const getStudent = async (id) => {
    const query = `SELECT * FROM students WHERE id = ${id}`;
    connection.query(query, async (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        res = results[0];
        const s = new Student(res);
        console.log(s)
        return s
    });
};

// Read attribute into variable
const getStudentsByName = async(name) => {
    const last = name.last || null;
    const middle = name.midde || null;
    const first = name.first || null;
    let numConstraints = 0
    let query = `SELECT id FROM students WHERE `;
    if (last) {
        query += `last = '${last}' `;
        numConstraints++;
    }
    if (middle) {
        if (numConstraints > 0) {
            query += 'AND ';
        }
        query += `middle = '${middle}' `;
        numConstraints++;
    }
    if (first) {
        if (numConstraints > 0) {
            query += 'AND ';
        }
        query += `first = '${first}' `;
    }
    connection.query(query, async (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        res = results.map((x) => { return x.id });
        console.log(res);
        return res;
    });
};

// Insert into table
const insertStudent = async (payload) => {
    const last = payload.last;
    const middle = payload.middle || '';
    const first = payload.first;
    const year = payload.year;
    const gpa = payload.gpa || null;
    const query = `INSERT INTO students (last, middle, first, year, gpa) VALUES
                   ('${last}', '${middle}', '${first}', ${year}, ${gpa})`;
    connection.query(query, async (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Inserted student with values: ${payload}`);
  });
};

// Delete from table
const deleteStudent = async (id) => {
    const query = `DELETE FROM students WHERE id = ${id}`;
    connection.query(query, async (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Deleted student with id: ${id}`);
    });
};

// Enroll student in course
const addStudentToCourse = async (studentID, courseID) => {
    const query = `INSERT INTO studentCourseRel (studentID, courseID) VALUES
                   (${studentID}, ${courseID})`;
    connection.query(query, async (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Added student with ID ${studentID} to course with ID ${courseID}`);
    });
};

const payload = {
    last: 'Dumb',
    first: 'Big',
    year: 4
};
//simpleQuery();
//getStudent(10003);
//insertStudent(payload)
//deleteStudent(10005)
const name = {
    last: 'ylliB',
    first: 'Billy'
};
//getStudentsByName(name);
addStudentToCourse(10001, 10000);

connection.end();
