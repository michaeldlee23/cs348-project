DROP PROCEDURE IF EXISTS moveDepartmentFunds;
DELIMITER //

CREATE PROCEDURE moveDepartmentFunds (IN din INT, IN ddelete INT)

BEGIN

SET @money = (SELECT budget FROM departments WHERE id=ddelete);
UPDATE departments
SET budget=budget + @money
WHERE id=din;

END //
DELIMITER ;

