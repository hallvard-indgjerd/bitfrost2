start transaction;

update time_series_specific set `end` = -1701 where id = 8;
update time_series_specific set `start` = -1700, `end` = -1501 where id = 9;
update time_series_specific set `end` = -901 where id = 12;
update time_series_specific set `start` = -900, `end` = -701 where id = 13;
update time_series_specific set `start` = -700 where id = 14;

commit;