'use strict';

const getAdvisorSchema = require('./getAdvisor')
const postAdvisorSchema = require('./postAdvisor');
const putAdvisorSchema = require('./putAdvisor');

module.exports = {
    getAdvisorSchema,
    postAdvisorSchema,
    putAdvisorSchema,
}