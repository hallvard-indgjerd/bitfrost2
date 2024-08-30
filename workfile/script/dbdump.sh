#!/bin/bash
/usr/bin/mysqldump --defaults-file=/home/beppe/.my.cnf --add-drop-database -c --no-tablespaces -vvv omekas > /var/www/html/plus/workfile/dump/$(date "+%y%m%d")_dynamic.sql
