#!/bin/bash
mongoimport -d Helldive -c Equipment --type csv --file /data/sources/Equipment.csv --headerline --username='root' --password='root' --authenticationDatabase=admin
# mongoimport -d Helldive -c Presets --type csv --file /data/db/Presets.csv --headerline --username='root' --password='root' --authenticationDatabase=admin
mongoimport -d Helldive -c Sources --type csv --file /data/sources/Sources.csv --headerline --username='root' --password='root' --authenticationDatabase=admin