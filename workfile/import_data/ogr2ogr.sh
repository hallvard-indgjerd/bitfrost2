#!/usr/bin/env bash
ogr2ogr -f MySQL MySQL:omekas,host=91.121.82.80,user=omeka,password=omeka4lund /home/beppe/Documenti/lavoro/geodati/shp/se/SWE_adm2.shp -nln city -progress -update -overwrite -nlt POLYGON -lco engine=InnoDB
ogr2ogr -f MySQL MySQL:omekas,host=91.121.82.80,user=omeka,password=omeka4lund /home/beppe/Documenti/lavoro/geodati/shp/no/NOR_adm2.shp -nln city -progress -update -append -nlt POLYGON -lco engine=InnoDB

ogr2ogr -f MySQL MySQL:omekas,host=91.121.82.80,user=omeka,password=omeka4lund /home/beppe/Documenti/lavoro/geodati/shp/se/SWE_adm1.shp -nln county -progress -update -overwrite -nlt POLYGON -lco engine=InnoDB
ogr2ogr -f MySQL MySQL:omekas,host=91.121.82.80,user=omeka,password=omeka4lund /home/beppe/Documenti/lavoro/geodati/shp/no/NOR_adm1.shp -nln county -progress -update -append -nlt POLYGON -lco engine=InnoDB

ogr2ogr -f MySQL MySQL:omekas,host=91.121.82.80,user=omeka,password=omeka4lund /home/beppe/Documenti/lavoro/geodati/shp/se/SWE_adm0.shp -nln nation -progress -update -overwrite -nlt POLYGON -lco engine=InnoDB
ogr2ogr -f MySQL MySQL:omekas,host=91.121.82.80,user=omeka,password=omeka4lund /home/beppe/Documenti/lavoro/geodati/shp/no/NOR_adm0.shp -nln nation -progress -update -append -nlt POLYGON -lco engine=InnoDB
