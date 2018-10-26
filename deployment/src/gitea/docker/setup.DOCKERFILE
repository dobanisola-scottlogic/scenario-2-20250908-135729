FROM alpine:latest

ENV \
    GITEA_ADMIN_USER=ScottLogic \
    GITEA_ADMIN_PASSWORD=5lgitHack \
    GITEA_ADMIN_EMAIL=hackathon@scottlogic.co.uk \
    GITEA_HOST=gitea \
    GITEA_PORT=3000

ADD scripts/setup-repo.sh /scripts/setup-repo

RUN apk --no-cache add curl bash dos2unix git \
    && dos2unix /scripts/* \
    && curl https://raw.githubusercontent.com/eficode/wait-for/f71f8199a0dd95953752fb5d3f76f79ced16d47d/wait-for > /scripts/wait-for \
    && chmod -R +x /scripts

ADD repo /repo
RUN cd /repo \
    && git init \
    && git config user.name "$GITEA_ADMIN_USER" \
    && git config user.email "$GITEA_ADMIN_EMAIL" \
    && git add . \
    && git commit -m 'Scott Logic Hackathon'

WORKDIR /repo
CMD /scripts/wait-for ${GITEA_HOST}:${GITEA_PORT} -t 120 -- /scripts/setup-repo