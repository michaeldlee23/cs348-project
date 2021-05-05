DROP PROCEDURE IF EXISTS getCourseData;
DELIMITER //

CREATE PROCEDURE getCourseData (IN teacher_id INT)

BEGIN
DROP TABLE IF EXISTS result1;
DROP TABLE IF EXISTS result2;

CREATE TEMPORARY TABLE result1 (courseID INT, code varchar(15), name varchar(50), department varchar(100));
CREATE TEMPORARY TABLE result2 (courseID INT, code varchar(15), name varchar(50), department varchar(100));

INSERT INTO result1
SELECT cour.id AS courseID, code, cour.name, d.name AS department 
FROM departments AS d 
JOIN courses AS cour
ON cour.departmentID=d.id;

IF teacher_id > 0 THEN
    INSERT INTO result2
    SELECT b.courseID, code, b.name, department
    FROM 
        (SELECT * 
        FROM teacherCourseRel 
        WHERE teacherID=teacher_id) AS a 
        JOIN ( SELECT * FROM result1 ) AS b 
        ON a.courseID=b.courseID;
ELSE
    INSERT INTO result2
    SELECT * FROM result1;
END IF;

SELECT co.courseID, co.code, co.name, co.department, COALESCE(num.numStudents, 0) AS numStudents 
                            FROM (SELECT * FROM result2) AS co 
                                LEFT JOIN (SELECT courseID, count(*) AS numStudents 
                                    FROM (
                                        SELECT * 
                                        FROM studentCourseRel AS sc 
                                        JOIN students AS s ON sc.studentID=s.id) AS m 
                                    GROUP BY m.courseID) AS num 
                                ON co.courseID=num.courseID;

END //
DELIMITER ;

