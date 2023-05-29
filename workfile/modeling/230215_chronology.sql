begin;
drop table if exists period3;
drop table if exists period2;
drop table if exists period1;
create table period1(
	id int primary key auto_increment,
    en_value varchar(50),
    sw_value varchar(50),
    unique key UNIQ_PERIOD1 (en_value, sw_value)
) engine = InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;
create table period2(
	id int primary key auto_increment,
    period1 int not null,
    en_value varchar(50),
    sw_value varchar(50),
    constraint FK_PERIOD2_PERIOD1 foreign key (period1) references period1(id),
    unique key UNIQ_PERIOD2 (en_value, sw_value)
) engine = InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;
create table period3(
	id int primary key auto_increment,
    period2 int not null,
    en_value varchar(50),
    sw_value varchar(50),
    start int,
    end int,
    constraint FK_PERIOD3_PERIOD2 foreign key (period2) references period2(id),
    unique key UNIQ_PERIOD3 (en_value, sw_value)
) engine = InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;
insert into period1(sw_value, en_value) values ('Stenålder','Stone Age'), ('Bronsålder','Bronze Age'), ('Järnålder','Iron Age'), ('Medeltid','Middle Ages'), ('Nyare tid','Modern Ages');
insert into period2(period1, sw_value, en_value) values (1,'Paleolitikum', 'Paleolithic'), (1,'Mesolitikum', 'Mesolithic'), (1,'Neolitikum', 'Neolithic'), (2,'Äldre Bronsålder', 'Early Bronze Age'), (2,'Yngre bronsålder', 'Younger Bronze Age'), (3,'Äldre järnålder', 'Early Iron Age'), (3,'Yngre järnålder', 'Younger Iron Age'), (4,'Tidigmedeltid', 'Early Middle Ages'), (4,'Högmedeltid', 'High Middle Ages'), (4,'Senmedeltid', 'Late Middle Ages'), (5,'Tidigmodern tid', 'Early modern period'), (5,'Senmodern tid', 'Late modern period');
insert into period3(period2, sw_value, en_value) values (1, 'Tidigpaleolitikum', 'Early Paleolithic'), (1, 'Mellanpaleolitikum', 'Middle Paleolithic'), (1, 'Senpaleolitikum', 'Late Paleolithic'), (2, 'Tidigmesolitikum', 'Early Mesolithic'), (2, 'Mellanmesolitikum', 'Middle Mesolithic'), (2, 'Senmesolitikum', 'Late Mesolithic'), (3, 'Tidigneolitikum I', 'Early Neolithic I'), (3, 'Tidigneolitikum II', 'Early Neolithic II'), (3, 'Mellanneolitikum A', 'Middle Neolithic A'), (3, 'Mellanneolitikum B', 'Middle Neolithic B'), (3, 'Senneolitikum', 'Late Neolithic'), (4, 'Bronsålder period I', 'Bronze Age period I'), (4, 'Bronsålder period II', 'Bronze Age period II'), (4, 'Bronsålder period III', 'Bronze Age period III'), (5, 'Bronsålder period IV', 'Bronze Age period IV'), (5, 'Bronsålder period V', 'Bronze Age period V'), (5, 'Bronsålder period VI', 'Bronze Age period VI'), (6, 'Förromersk järnålder period I', 'Pre-Roman Iron Age Period I'), (6, 'Förromersk järnålder period II', 'Pre-Roman Iron Age period II'), (6, 'Förromersk järnålder period III', 'Pre-Roman Iron Age period III'), (6, 'Äldre romersk järnålder', 'Early Roman Iron Age'), (6, 'Yngre romersk järnålder', 'Younger Roman Iron Age'), (7, 'Folkvandringstid', 'Migration period'), (7, 'Vendeltid', 'turnaround time'), (7, 'Vikingatid', 'Viking age'), (8, 'Tidigmedeltid', 'Early Middle Ages'), (9, 'Högmedeltid', 'High Middle Ages'), (10, 'Senmedeltid', 'Late Middle Ages'), (11, '1500-1599', '1500-1600'), (11, '1600-1699', '1600-1700'), (11, '1700-1799', '1700-1800'), (12, '1800-1899', '1800-1900'), (12, '1900-1999', '1900-2000'), (12, '2000-', '2000-');
commit;