#!/usr/bin/env bash

if [ -n "$DB_TYPE" ] ; then
    case "$DB_TYPE" in
        postgres*)
            DB_PROTO=postgresql
            DB_DRIVER=org.postgresql.Driver
            DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect
            ;;
# MYSQL doesn't seem to work
#        mysql)
#            DB_PROTO=mysql
#            DB_DRIVER=org.mariadb.jdbc.Driver
#            DB_DIALECT=org.hibernate.dialect.MySQLDialect
#            ;;
        *)
            echo "Unrecognised database type: $DB_TYPE." >&2
            exit 1
            ;;
    esac
    DB_URL=${DB_PROTO}://${DB_HOST}:${DB_PORT}/${DB_NAME}
    echo "Waiting for database: $DB_HOST:$DB_PORT"
    sleep 15
else
    echo "Neither DB_URL or DB_TYPE variables are set. Defaulting to local H2 database."
    DB_URL=h2:~/hackathon.db
    DB_DRIVER=org.h2.Driver
    DB_DIALECT=org.hibernate.dialect.H2Dialect
fi

JAVA_OPTS="${JAVA_OPTS:+${JAVA_OPTS} }-Ddw.database.url=jdbc:$DB_URL"
JAVA_OPTS="$JAVA_OPTS -Ddw.database.driverClass=$DB_DRIVER -Ddw.database.properties.hibernate.dialect=$DB_DIALECT"
[ -n "$DB_USER" ] && JAVA_OPTS="$JAVA_OPTS -Ddw.database.user=$DB_USER"
[ -n "$DB_PASSWORD" ] && JAVA_OPTS="$JAVA_OPTS -Ddw.database.password=$DB_PASSWORD"
export JAVA_OPTS

set -x
java ${JAVA_OPTS} -jar /jars/server*.jar server /conf/server.yml
