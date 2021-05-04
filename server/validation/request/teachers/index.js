'use strict';

const getTeacherSchema = require('./getTeacher');
const postTeacherSchema = require('./postTeacher');
const putTeacherSchema = require('./putTeacher');
const postTeacherCourseSchema = require('./postTeacherCourse');
const putTeacherCourseSchema = require('./putTeacherCourse');

module.exports = {
    getTeacherSchema,
    postTeacherSchema,
    putTeacherSchema,
    postTeacherCourseSchema,
    putTeacherCourseSchema,
}
