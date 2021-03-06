'use strict';

const getStudentSchema = require('./getStudent')
const postStudentSchema = require('./postStudent');
const putStudentSchema = require('./putStudent');
const postStudentCourseSchema = require('./postStudentCourse');
const putStudentCourseSchema = require('./putStudentCourse');
const deleteStudentCourseSchema = require('./deleteStudentCourse');
const postStudentOrganizationSchema = require('./postStudentOrganization');
const putStudentOrganizationSchema = require('./putStudentOrganization');
const deleteStudentOrganizationSchema = require('./deleteStudentOrganization');

module.exports = {
    getStudentSchema,
    postStudentSchema,
    putStudentSchema,
    postStudentCourseSchema,
    deleteStudentCourseSchema,
    putStudentCourseSchema,
    postStudentOrganizationSchema,
    putStudentOrganizationSchema,
    deleteStudentOrganizationSchema,
}