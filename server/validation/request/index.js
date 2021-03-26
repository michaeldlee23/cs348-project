'use strict';

const postStudentSchema = require('./postStudent');
const putStudentSchema = require('./putStudent');
const postCourseSchema = require('./postCourse');
const putCourseSchema = require('./putCourse');
const postStudentCourseSchema = require('./postStudentCourse');
const putStudentCourseSchema = require('./putStudentCourse');
const postAuthSchema = require('./postAuth');

const postStudentOrganizationSchema = require('./postStudentOrganization');
const putStudentOrganizationSchema = require('./putStudentOrganization');
const postTeacherSchema = require('./postTeacher');
const putTeacherSchema = require('./putTeacher');
const postTeacherCourseSchema = require('./postTeacherCourse');

module.exports = {
    postStudentSchema,
    putStudentSchema,

    postCourseSchema,
    putCourseSchema,

    postStudentCourseSchema,
    putStudentCourseSchema,

    postStudentOrganizationSchema,
    putStudentOrganizationSchema,

    postTeacherSchema,
    putTeacherSchema,

    postTeacherCourseSchema,

    postAuthSchema,
};

