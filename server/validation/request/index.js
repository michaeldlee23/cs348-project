'use strict';

const postStudentSchema = require('./postStudent');
const putStudentSchema = require('./putStudent');
const postAdvisorSchema = require('./postAdvisor');
const putAdvisorSchema = require('./putAdvisor');
const postCourseSchema = require('./postCourse');
const putCourseSchema = require('./putCourse');
const postOrganizationSchema = require('./postOrganization');
const putOrganizationSchema = require('./putOrganization');
const postStudentCourseSchema = require('./postStudentCourse');
const putStudentCourseSchema = require('./putStudentCourse');
const postAuthSchema = require('./postAuth');

module.exports = {
    postStudentSchema,
    putStudentSchema,
    postAdvisorSchema,
    putAdvisorSchema,
    postCourseSchema,
    putCourseSchema,
    postOrganizationSchema,
    putOrganizationSchema,
    postStudentCourseSchema,
    putStudentCourseSchema,
    postAuthSchema,
};
