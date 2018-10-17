#!/bin/bash

export GITEA_USER=$GITEA_ADMIN_USER
export GITEA_URL="http://${GITEA_ADMIN_USER}:${GITEA_ADMIN_PASSWORD}@${GITEA_HOST}:${GITEA_PORT}"

REPO_NAME=hackathon-contestant
CLONE_URL="https://github.com/ScottLogic/hackathon-ai-game-contestant.git"

curl -vsS "$GITEA_URL/api/v1/repos/migrate" -H "Content-Type: application/json" -d @- << EOF
{
    "auth_username": "$GH_USER",
    "auth_password": "$GH_PASSWORD",
    "clone_addr": "$CLONE_URL",
    "mirror": false,
    "private": false,
    "repo_name": "hackathon-contestant",
    "uid": 1
}
EOF