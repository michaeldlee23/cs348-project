'use strict';

const getCourseSchema = require('./getCourse');
const postCourseSchema = require('./postCourse');
const putCourseSchema = require('./putCourse');

module.exports = {
    getCourseSchema,
    postCourseSchema,
    putCourseSchema,
}