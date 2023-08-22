drop table if exists user_person;
create table user_person(
  person int not null,
  user int not null,
  role int not null default 6,
  CONSTRAINT PRIMARY KEY (person,user),
  CONSTRAINT FOREIGN KEY (person) REFERENCES person(id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (user) REFERENCES user(id) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (role) REFERENCES list_user_role(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

insert into user_person values
