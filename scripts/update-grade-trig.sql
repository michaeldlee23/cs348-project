DROP TRIGGER IF EXISTS after_update_grade;

DELIMITER ;;
CREATE TRIGGER after_update_grade
AFTER UPDATE ON courses
FOR EACH ROW
BEGIN
    UPDATE students
    SET gpa = (
        EXEC CalcGPA(students.id)
    )
    WHERE students.id = new.studentID;
END
;;

DELIMITER ;