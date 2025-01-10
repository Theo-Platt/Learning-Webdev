#!/bin/bash
mongoimport -d Helldive -c Equipment --type csv --file /data/db/Equipment.csv --headerline --username='root' --password='root' --authenticationDatabase=admin
# mongoimport -d Helldive -c Presets --type csv --file /data/db/Presets.csv --headerline --username='root' --password='root' --authenticationDatabase=admin
mongoimport -d Helldive -c Sources --type csv --file /data/db/Sources.csv --headerline --username='root' --password='root' --authenticationDatabase=admin