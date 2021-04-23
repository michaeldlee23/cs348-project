'use strict';

const admin = require('./admin');
const students = require('./students');
const teachers = require('./teachers');
const advisors = require('./advisors');
const admins = require('./admin');
const courses = require('./courses');
const organizations = require('./organizations');
const postAuthSchema = require('./postAuth');
const departments = require('./departments')

module.exports = {
    admin,
    students,
    teachers,
    advisors,
    admins,
    courses,
    organizations,
    postAuthSchema,
    departments,
};
