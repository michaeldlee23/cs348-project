'use strict';

const postStudentSchema = require('./postStudent');
const putStudentSchema = require('./putStudent');
const postCourseSchema = require('./postCourse');
const putCourseSchema = require('./putCourse');
const postStudentCourseSchema = require('./postStudentCourse');
const putStudentCourseSchema = require('./putStudentCourse');

module.exports = {
    postStudentSchema,
    putStudentSchema,
    postCourseSchema,
    putCourseSchema,
    postStudentCourseSchema,
    putStudentCourseSchema,
};
