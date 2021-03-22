-- INSERT INTO students (email, password, last, first, middle, year, birthdate, phone) VALUES
--     ('alice@mail.com', 'pass', 'Lmao', 'Alice', '', 2, '1999-3-18', '555-123-4567'),
--     ('billy@yllib.com', 'bill', 'ylliB', 'Billy', 'B', 1, '2000-2-22', '555-987-6543'),
--     ('student@school.com', 'password', 'McStudentFace', 'Student', '', 3, '1998-1-1', '555-555-5555')
-- ;

INSERT INTO teachers (email, password, last, first, middle, salary, birthdate, phone) VALUES
    ('jeff@purdue.edu', 'apestogether', 'Turkstra', 'Jeffery', '', 999999.99, '514-12-25', '765-388-0923'),
    ('teacher@school.com', 'PASSWORD', 'McTeacherFace', 'Teacher', 'D', 8, '2018-3-23', '888-888-8888'),
    ('stat@quest.com', 'quest', 'Starmer','Josh', 'R', 314159, '1978-4-13', '555-222-2222'),
    ('math@meth.com', 'man', 'Mathman', 'Numbers', 'E',  NULL, '1988-7-13', '271-828-1828')
;

INSERT INTO advisors (email, password, last, first, middle, salary, birthdate, phone) VALUES
    ('jones@purdue.edu', 'advisorman', 'Jones', 'Kevin', '', 888888, '1980-8-9', '111-111-1111'),
    ('advisor@school.com', 'pASSword', 'McAdvisorFace', 'Advisor', '', 100, '1776-7-4', '689-392-1239')
;

INSERT INTO courses (code, name) VALUES
    ('CS348', 'Database and Information Systems'),
    ('STAT512', 'Applied Regression Analysis'),
    ('MA453', 'Abstract AIDs'),
    ('CS390-NIP', 'Neural Image Processing')
;

INSERT INTO departments (name) VALUES
    ('Computer Science'),
    ('Mathematics'),
    ('Statistics')
;

INSERT INTO organizations (name, type, budget) VALUES
    ('Underwater Basket Weaving', 'Athletic', 999999),
    ('Eta Sigma Pi', 'Fraternity', 31415),
    ('Alcoholics Anonymous', 'Social', 0.78)
;
