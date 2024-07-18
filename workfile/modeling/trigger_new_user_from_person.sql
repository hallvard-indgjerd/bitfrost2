DELIMITER $$

CREATE TRIGGER new_user_from_person
AFTER INSERT
ON person FOR EACH ROW
BEGIN
    IF NEW.user_id = 1 THEN
        INSERT INTO user(email, name, created, role, is_active)
        VALUES(NEW.email,CONCAT(NEW.first_name,' ',NEW.last_name), now(), 3, 1);
    END IF;
END$$

DELIMITER ;