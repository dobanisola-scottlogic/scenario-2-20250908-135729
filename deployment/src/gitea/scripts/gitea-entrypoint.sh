#!/bin/bash

if [ -f /data/gitea/gitea.db ] ; then
    echo "Database already exists"
else
    echo "Setting up..."
    mkdir -p /data/gitea/conf \
    && cp /conf/app.ini /data/gitea/conf \
    && sqlite3 /data/gitea/gitea.db < /conf/db.sql \
    && chown -R $USER:$USER /data/gitea \
    && /usr/bin/entrypoint /app/gitea/gitea admin create-user \
        --name $GITEA_ADMIN_USER \
        --password "$GITEA_ADMIN_PASSWORD" \
        --email "$GITEA_ADMIN_EMAIL" \
        --admin \
    || exit $?
fi

/usr/bin/entrypoint "$@"
