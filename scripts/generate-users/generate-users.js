const generateStudents = require('./generate-students');
const generateTeachers = require('./generate-teachers');
const generateAdvisors = require('./generate-advisors');
const generateAdmins = require('./generate-admins');

const NUM_TO_GENERATE = 10;

generateStudents(NUM_TO_GENERATE);
generateTeachers(NUM_TO_GENERATE);
generateAdvisors(NUM_TO_GENERATE);
generateAdmins(NUM_TO_GENERATE);
