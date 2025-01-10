FROM mongo

#environment settings
ENV MONGO_INITDB_ROOT_USERNAME root
ENV MONGO_INITDB_ROOT_PASSWORD root
ENV MONGO_INITDB_DATABASE Helldive

#copy the data
COPY ./data/Equipment.csv /data/db/
COPY ./data/Sources.csv /data/db/

COPY ./setup/importscript.sh /docker-entrypoint-initdb.d/

ADD ./setup/init-mongo.js /docker-entrypoint-initdb.d/