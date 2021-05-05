DROP PROCEDURE IF EXISTS changeDepartmentTable;
DELIMITER //

CREATE PROCEDURE changeDepartmentTable (IN tablename varchar(50), IN din INT, IN ddelete INT)

BEGIN

SET @sql_q = concat('UPDATE ', tablename, ' SET departmentID=', din, ' WHERE departmentID=', ddelete);

PREPARE stmnt FROM @sql_q;
EXECUTE stmnt;
DEALLOCATE PREPARE stmnt;

END //
DELIMITER ;

