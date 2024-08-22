
mysql -u username -p -e "select c.value class, s.value specs from list_category_class c inner join list_category_specs s on s.category_class = c.id order by 1 asc;" --batch --silent --raw > workfile/output.csv
