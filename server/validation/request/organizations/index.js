'use strict';

const postOrganizationSchema = require('./postOrganization');
const putOrganizationDetailsSchema = require('./putOrganizationDetails');
const putOrganizationBudgetSchema = require('./putOrganizationBudget');

module.exports = {
    postOrganizationSchema,
    putOrganizationDetailsSchema,
    putOrganizationBudgetSchema,
}