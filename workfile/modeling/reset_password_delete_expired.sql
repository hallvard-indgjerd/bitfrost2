CREATE EVENT delete_new_pwd_token
  ON SCHEDULE 
    EVERY 1 DAY
  COMMENT 'delete row in reset_password table if token is expired'
  DO 
    DELETE FROM reset_password where now() > exp_date;