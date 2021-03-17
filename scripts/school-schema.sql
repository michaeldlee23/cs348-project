DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS teacherCourseRel;
DROP TABLE IF EXISTS studentCourseRel;

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE students (
    id int(16) NOT NULL AUTO_INCREMENT,
    last varchar(50),
    middle varchar(1),
    first varchar(50),
    year tinyint,
    gpa float DEFAULT NULL,
    PRIMARY KEY (id)
);
-- Set initial PK value
ALTER TABLE students AUTO_INCREMENT=10000;

CREATE TABLE teachers (
    id int(16) NOT NULL AUTO_INCREMENT,
    last varchar(50),
    middle varchar(1),
    first varchar(50),
    salary float,
    PRIMARY KEY (id)
);
ALTER TABLE teachers AUTO_INCREMENT=10000;

CREATE TABLE courses (
    id int(16) NOT NULL AUTO_INCREMENT,
    code varchar(15),
    name varchar(50),
    PRIMARY KEY (id)
);
ALTER TABLE courses AUTO_INCREMENT=10000;

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

SET FOREIGN_KEY_CHECKS=1;
