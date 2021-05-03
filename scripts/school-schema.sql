SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS advisors;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS teacherCourseRel;
DROP TABLE IF EXISTS studentCourseRel;
DROP TABLE IF EXISTS studentOrganizationRel;


CREATE TABLE admin (
    id int(16) NOT NULL AUTO_INCREMENT,
    email varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    last varchar(50) NOT NULL,
    first varchar(50) NOT NULL,
    middle varchar(1),
    birthdate date NOT NULL,
    salary float DEFAULT 0 CHECK (salary >= 0),
    phone char(12) NOT NULL,
    scope varchar(100),
    PRIMARY KEY (id),
    UNIQUE KEY uniqueEmail (email)
);
ALTER TABLE admin AUTO_INCREMENT=10000;

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
    advisorID int(16) NOT NULL,
    scope varchar(100),
    PRIMARY KEY (id),
    FOREIGN KEY (advisorID) REFERENCES advisors (id),
    UNIQUE KEY uniqueEmail (email)
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
    salary float DEFAULT 0 CHECK (salary >= 0),
    phone char(12) NOT NULL,
    scope varchar(100),
    departmentID int(16),
    PRIMARY KEY (id),
    FOREIGN KEY (departmentID) REFERENCES departments (id),
    UNIQUE KEY uniqueEmail (email)
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
    salary float DEFAULT 0 CHECK (salary >= 0),
    phone char(12) NOT NULL,
    scope varchar(100),
    PRIMARY KEY (id),
    UNIQUE KEY uniqueEmail (email)
);
ALTER TABLE advisors AUTO_INCREMENT=10000;

CREATE TABLE courses (
    id int(16) NOT NULL AUTO_INCREMENT,
    code varchar(15),
    name varchar(50),
    departmentID int(16) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (departmentID) REFERENCES departments (id) ON DELETE CASCADE
);
ALTER TABLE courses AUTO_INCREMENT=10000;

CREATE TABLE organizations (
    id int(16) NOT NULL AUTO_INCREMENT,
    name varchar(200),
    type varchar(50),
    budget float DEFAULT 0 CHECK (budget >= 0),
    departmentID int(16) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT organizationDepartmentRel_fk1 FOREIGN KEY (departmentID)
        REFERENCES departments (id) ON DELETE CASCADE
);
ALTER TABLE organizations AUTO_INCREMENT=10000;

CREATE TABLE departments (
    id int(16) NOT NULL AUTO_INCREMENT,
    name varchar (100),
    budget float DEFAULT 0 CHECK (budget >= 0),
    PRIMARY KEY (id)
);
ALTER TABLE departments AUTO_INCREMENT=10000;

CREATE TABLE teacherCourseRel (
    teacherID int(16) NOT NULL,
    courseID int(16) NOT NULL,
    PRIMARY KEY (teacherID, courseID),
    CONSTRAINT teacherCourseRel_fk1 FOREIGN KEY (teacherID)
        REFERENCES teachers (id) ON DELETE CASCADE,
    CONSTRAINT teacherCourseRel_fk2 FOREIGN KEY (courseID)
        REFERENCES courses (id) ON DELETE CASCADE
);

CREATE TABLE studentCourseRel (
    studentID int(16) NOT NULL,
    courseID int(16) NOT NULL,
    grade float,
    PRIMARY KEY (studentID, courseID),
    CONSTRAINT studentCourseRel_fk1 FOREIGN KEY (studentID)
        REFERENCES students (id) ON DELETE CASCADE,
    CONSTRAINT studentCourseRel_fk2 FOREIGN KEY (courseID)
        REFERENCES courses (id) ON DELETE CASCADE
);
CREATE INDEX grade ON studentCourseRel(grade);

CREATE TABLE studentOrganizationRel (
    studentID int(16) NOT NULL,
    organizationID int(16) NOT NULL,
    position varchar(50),
    CONSTRAINT studentOrganizationRel_fk1 FOREIGN KEY (studentID)
        REFERENCES students (id) ON DELETE CASCADE,
    CONSTRAINT studentOrganizationRel_fk2 FOREIGN KEY (organizationID)
        REFERENCES organizations (id) ON DELETE CASCADE
);
CREATE INDEX position ON studentOrganizationRel(position);

SET FOREIGN_KEY_CHECKS=1;

source trigger-before-delete-departments.sql;
