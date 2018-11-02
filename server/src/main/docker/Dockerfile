FROM openjdk:latest
ARG MAINTAINER="Scott Logic"
ARG PORT=8080
ARG MAIN

MAINTAINER ${MAINTAINER}

COPY hackathon /hackathon
RUN chmod -R 644 /hackathon \
    && chmod -R +X /hackathon \
    && chmod +x /hackathon/entrypoint*

EXPOSE ${PORT}

ENV MAIN ${MAIN}

WORKDIR /hackathon
ENTRYPOINT ["./entrypoint.sh"]
