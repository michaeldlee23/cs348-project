'use strict';

const postStudentSchema = require('./postStudent');
const putStudentSchema = require('./putStudent');
const postStudentCourseSchema = require('./postStudentCourse');
const putStudentCourseSchema = require('./putStudentCourse');
const postStudentOrganizationSchema = require('./postStudentOrganization');
const putStudentOrganizationSchema = require('./putStudentOrganization');

module.exports = {
    postStudentSchema,
    putStudentSchema,
    postStudentCourseSchema,
    putStudentCourseSchema,
    postStudentOrganizationSchema,
    putStudentOrganizationSchema
}