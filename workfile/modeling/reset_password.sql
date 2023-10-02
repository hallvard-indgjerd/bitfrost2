create table reset_password(
  email varchar(100) not null,
  token varchar(255) not null,
  exp_date varchar(250) not null default (date_add(now(), interval 1 day)),
  primary key (email)
) ENGINE=InnoDB CHARSET=utf8mb4;