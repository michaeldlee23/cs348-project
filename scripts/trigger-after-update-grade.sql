DROP TRIGGER IF EXISTS after_update_grade;

DELIMITER ;;
CREATE TRIGGER after_update_grade
AFTER UPDATE ON studentCourseRel
FOR EACH ROW
BEGIN
    CALL CalcGPA(new.studentID, @GPA);
    UPDATE students
    SET gpa = @GPA
    WHERE students.id = new.studentID;
END
;;

DELIMITER ;