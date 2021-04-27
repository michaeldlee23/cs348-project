DROP TRIGGER IF EXISTS before_delete_departments;

DELIMITER ;;
CREATE TRIGGER before_delete_departments
BEFORE DELETE ON departments
FOR EACH ROW
BEGIN
    UPDATE teachers
    SET departmentID = NULL
    WHERE departmentID = old.id;
END
;;

DELIMITER ;