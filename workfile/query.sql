select a.id, a.name,  c.id class, c.value, s.id specs, s.value 
from artifact a 
inner join list_category_class c on a.category_class = c.id 
left join list_category_specs s on a.category_specs = s.id 
where c.value in ('Algrgr','Sköålgrop','Munkarp Ageröd V VI','Otriarkt','Uppfrisknissaulas','FI_VI','Burlöv','Keramik','Dagger','Syvyxa','Spintspets') 
order by 2 asc;
