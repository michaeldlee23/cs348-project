'use strict';

const getStudentSchema = require('./getStudent')
const postStudentSchema = require('./postStudent');
const putStudentSchema = require('./putStudent');
const postStudentCourseSchema = require('./postStudentCourse');
const putStudentCourseSchema = require('./putStudentCourse');
const postStudentOrganizationSchema = require('./postStudentOrganization');
const putStudentOrganizationSchema = require('./putStudentOrganization');

module.exports = {
    getStudentSchema,
    postStudentSchema,
    putStudentSchema,
    postStudentCourseSchema,
    putStudentCourseSchema,
    postStudentOrganizationSchema,
    putStudentOrganizationSchema
}