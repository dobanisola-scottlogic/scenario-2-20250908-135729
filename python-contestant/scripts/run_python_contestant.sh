#/bin/sh

if pgrep -a -f remote-1.0-SNAPSHOT
then
    echo -e "\n"
    echo "This looks like there might already be a contestant running, maybe in a different terminal."
    echo "Please terminate that process and try again."
    exit
fi

if [[ -z "$TEAM_NAME" ]]; then
    echo "Enter team name (or set TEAM_NAME in environment):"
    read TEAM_NAME
fi

if [[ -z "$GAME_SERVER_HOST" ]]; then
    echo "Enter game server host (or set GAME_SERVER_HOST in environment):"
    read GAME_SERVER_HOST
fi

if [[ -z "$GAME_SERVER_PORT" ]]; then
    echo "Enter game server port (or set GAME_SERVER_PORT in environment):"
    read GAME_SERVER_PORT
fi

java -Dorg.slf4j.simpleLogger.showDateTime=true -Dorg.slf4j.simpleLogger.dateTimeFormat="yyyy-MM-dd HH:mm:ss:SSS Z" -Dorg.slf4j.simpleLogger.defaultLogLevel=all -jar libs/remote-1.0-SNAPSHOT-all.jar --command "python3 main.py" --team ${TEAM_NAME} --host ${GAME_SERVER_HOST} --port ${GAME_SERVER_PORT}