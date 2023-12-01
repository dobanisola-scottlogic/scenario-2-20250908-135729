#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PROJ_DIR="${SCRIPT_DIR}/../.."

if [[ -z "$TEAM_NAME" ]]; then
  TEAM_NAME='team1'
fi

if [[ -z "$GAME_SERVER_HOST" ]]; then
  GAME_SERVER_HOST='localhost'
fi

if [[ -z "$GAME_SERVER_PORT" ]]; then
  GAME_SERVER_PORT='8080'
fi

bots=()
for i in {1..5}; do
  bots+=("Milestone${i}Bot")
done
bots+=('Quit')

PS3='Select a bot: '
select bot in "${bots[@]}"; do
  case "$bot" in
    'Quit')
      break
      ;;
    *) java -Dorg.slf4j.simpleLogger.showDateTime=true \
        -Dorg.slf4j.simpleLogger.dateTimeFormat="yyyy-MM-dd HH:mm:ss:SSS Z" \
        -Dorg.slf4j.simpleLogger.defaultLogLevel=all \
        -jar ${PROJ_DIR}/remote/build/libs/remote-1.0-SNAPSHOT-all.jar \
        --botclasspath ${PROJ_DIR}/default-bots/build/classes/java/main --bot com.scottlogic.hackathon.bots.${bot} \
        --team ${TEAM_NAME} --host ${GAME_SERVER_HOST} --port ${GAME_SERVER_PORT}
      ;;
  esac
done
