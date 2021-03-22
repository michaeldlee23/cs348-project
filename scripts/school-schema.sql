DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS advisors;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS teacherCourseRel;
DROP TABLE IF EXISTS studentCourseRel;
DROP TABLE IF EXISTS studentAdvisorRel;
DROP TABLE IF EXISTS studentOrganizationRel;
DROP TABLE IF EXISTS teacherDepartmentRel;
DROP TABLE IF EXISTS teacherOrganizationRel;

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE students (
    id int(16) NOT NULL AUTO_INCREMENT,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    last varchar(50) NOT NULL,
    first varchar(50) NOT NULL,
    middle varchar(1),
    birthdate date NOT NULL,
    year tinyint NOT NULL,
    gpa float DEFAULT NULL,
    phone char(12) NOT NULL,
    scope varchar(100),
    PRIMARY KEY (id)
);
-- Set initial PK value
ALTER TABLE students AUTO_INCREMENT=10000;

CREATE TABLE teachers (
    id int(16) NOT NULL AUTO_INCREMENT,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    last varchar(50) NOT NULL,
    first varchar(50) NOT NULL,
    middle varchar(1),
    birthdate date NOT NULL,
    salary float,
    phone char(12) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE teachers AUTO_INCREMENT=10000;

CREATE TABLE advisors (
    id int(16) NOT NULL AUTO_INCREMENT,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    last varchar(50) NOT NULL,
    first varchar(50) NOT NULL,
    middle varchar(1),
    birthdate date NOT NULL,
    salary float,
    phone char(12) NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE advisors AUTO_INCREMENT=10000;

CREATE TABLE courses (
    id int(16) NOT NULL AUTO_INCREMENT,
    code varchar(15),
    name varchar(50),
    PRIMARY KEY (id)
);
ALTER TABLE courses AUTO_INCREMENT=10000;

CREATE TABLE organizations (
    id int(16) NOT NULL AUTO_INCREMENT,
    name varchar(200),
    type varchar(50),
    budget float,
    PRIMARY KEY (id)
);
ALTER TABLE organizations AUTO_INCREMENT=10000;

CREATE TABLE departments (
    id int(16) NOT NULL AUTO_INCREMENT,
    name varchar (100),
    PRIMARY KEY (id)
);
ALTER TABLE departments AUTO_INCREMENT=10000;

CREATE TABLE teacherCourseRel (
    teacherID int(16) NOT NULL,
    courseID int(16) NOT NULL,
    PRIMARY KEY (teacherID, courseID)
);

CREATE TABLE studentCourseRel (
    studentID int(16) NOT NULL,
    courseID int(16) NOT NULL,
    grade float,
    PRIMARY KEY (studentID, courseID)
);

CREATE TABLE studentAdvisorRel (
    studentID int(16) NOT NULL,
    advisorID int(16) NOT NULL,
    PRIMARY KEY (studentID, advisorID)
);

CREATE TABLE studentOrganizationRel (
    studentID int(16) NOT NULL,
    organizationID int(16) NOT NULL,
    position varchar(50)
);

CREATE TABLE teacherDepartmentRel (
    teacherID int(16) NOT NULL,
    departmentID int(16) NOT NULL,
    position varchar(50)
);

CREATE TABLE teacherOrganizationRel (
    teacherID int(16) NOT NULL,
    organizationID int(16) NOT NULL
);

SET FOREIGN_KEY_CHECKS=1;
