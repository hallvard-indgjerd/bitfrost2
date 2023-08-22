CREATE TABLE list_user_role(
  id INT AUTO_INCREMENT PRIMARY KEY,
  value varchar(100) NOT NULL,
  UNIQUE KEY UNIQ_USER_ROLE (value)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO list_user_role(value) values ('Administrator'), ('Supervisor'), ('Editor'), ('Reviewer'), ('Author'), ('Researcher');

CREATE TABLE user(
  id INT PRIMARY KEY AUTO_INCREMENT,
  email varchar(190) NOT NULL,
  name varchar(190) NOT NULL,
  created  datetime NOT NULL,
  modified datetime,
  password_hash varchar(60),
  role tinyint(1) NOT NULL,
  is_active tinyint(1) NOT NULL,
  UNIQUE KEY UNIQ_USER_EMAIL (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
