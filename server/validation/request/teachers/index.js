'use strict';

const getTeacherSchema = require('./getTeacher');
const postTeacherSchema = require('./postTeacher');
const putTeacherSchema = require('./putTeacher');
const postTeacherCourseSchema = require('./postTeacherCourse');

module.exports = {
    getTeacherSchema,
    postTeacherSchema,
    putTeacherSchema,
    postTeacherCourseSchema,
}
