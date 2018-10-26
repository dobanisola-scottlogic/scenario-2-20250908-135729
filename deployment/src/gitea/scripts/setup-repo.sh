#!/bin/bash

GITEA_USER=$GITEA_ADMIN_USER
GITEA_URL="http://${GITEA_ADMIN_USER}:${GITEA_ADMIN_PASSWORD}@${GITEA_HOST}:${GITEA_PORT}"
REPO_NAME=hackathon

curl -vsfS "$GITEA_URL/api/v1/user/repos" -H "Content-Type: application/json" -d @- << EOF || exit $?
{
    "auto_init": false,
    "description": "Scott Logic Hackathon",
    "private": false,
    "name": "$REPO_NAME"
}
EOF

git remote add origin "$GITEA_URL/$GITEA_ADMIN_USER/$REPO_NAME" || exit $?
git push -v -u origin master || exit $?
