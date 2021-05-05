-- Database schemas
source school-schema.sql;

-- Stored procedures
source sp-calc-gpa.sql
sourec sp-get-course-data.sql

-- Triggers
source trigger-after-update-grade.sql
source trigger-before-delete-departments.sql

-- Test data
source school-dummy-data.sql;
source generate-users/generate-teachers.sql;
source generate-users/generate-advisors.sql;
source generate-users/generate-admins.sql;
source generate-users/generate-students.sql;
