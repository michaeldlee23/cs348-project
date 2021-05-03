INSERT INTO departments (name,budget) VALUES
    ('Computer Science',500000),
    ('Mathematics',20000),
    ('Statistics',10000),
    ('Athletics', 1000000),
    ('Student Services', 75000)
;

INSERT INTO courses (code, name, departmentID) VALUES
    ('CS348', 'Database and Information Systems', 10000),
    ('STAT512', 'Applied Regression Analysis', 10002),
    ('MA453', 'Abstract AIDs', 10001),
    ('CS390-NIP', 'Neural Image Processing', 10000)
;

INSERT INTO organizations (name, type, departmentID) VALUES
    ('Underwater Basket Weaving', 'Athletic', 10003),
    ('Eta Sigma Pi', 'Fraternity', 10004),
    ('Alcoholics Anonymous', 'Social', 10004)
;

