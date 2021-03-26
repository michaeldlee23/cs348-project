'use strict';

const students = require('./students');
const teachers = require('./teachers');
const advisors = require('./advisors');
const courses = require('./courses');
const organizations = require('./organizations');
const postAuthSchema = require('./postAuth');

module.exports = {
    students,
    teachers,
    advisors,
    courses,
    organizations,
    postAuthSchema,
};
