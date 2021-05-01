DROP PROCEDURE IF EXISTS CalcGPA;
DELIMITER //

CREATE PROCEDURE CalcGPA (IN student_id int, OUT gpa float)

BEGIN
DECLARE four DECIMAL(12,10) DEFAULT 0;
DECLARE total int DEFAULT 0;
DECLARE current DECIMAL(12,10) DEFAULT 0;

DECLARE curGrade CURSOR FOR SELECT grade FROM studentCourseRel
WHERE student_id = studentID
GROUP BY studentID;

calc: LOOP
FETCH curGrade INTO current;
IF current > 92 THEN
SET four = four + 4.0;
ELSEIF current > 89 THEN
SET four = four + 3.7;
ELSEIF current > 86 THEN
SET four = four + 3.3;
ELSEIF current > 82 THEN
SET four = four + 3.0;
ELSEIF current > 79 THEN
SET four = four + 2.7;
ELSEIF current > 76 THEN
SET four = four + 2.3;
ELSEIF current > 72 THEN
SET four = four + 2.0;
ELSEIF current > 69 THEN
SET four = four + 1.7;
ELSEIF current > 66 THEN
SET four = four + 1.3;
ELSEIF current > 64 THEN
SET four = four + 1.0;
END IF;
SET total = total + 1;
END LOOP calc;
CLOSE curGrade;

SET gpa = four / total;

END //
DELIMITER;