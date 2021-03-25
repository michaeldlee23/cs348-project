'use strict';

const postStudentSchema = require('./postStudent');
const putStudentSchema = require('./putStudent');
const postCourseSchema = require('./postCourse');
const putCourseSchema = require('./putCourse');
const postStudentCourseSchema = require('./postStudentCourse');
const putStudentCourseSchema = require('./putStudentCourse');
const postTeacherCourseSchema = require('./postTeacherCourse');
const postStudentOrganizationSchema = require('./postStudentOrganization');
const putStudentOrganizationSchema = require('./putStudentOrganization');
const postAuthSchema = require('./postAuth');


module.exports = {
    postStudentSchema,
    putStudentSchema,
    postCourseSchema,
    putCourseSchema,
    postStudentCourseSchema,
    putStudentCourseSchema,
    postTeacherCourseSchema,
    postStudentOrganizationSchema,
    putStudentOrganizationSchema,
    postAuthSchema,
};
