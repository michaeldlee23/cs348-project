-- GUIDs are overkill for this but I'm keeping it here in case we want to do something similar

DROP TRIGGER IF EXISTS before_insert_students

DELIMITER ;;
CREATE TRIGGER before_insert_students
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
    IF new.id IS NULL THEN
        SET new.id = uuid();
    END IF;
END
;;

DELIMITER ;
