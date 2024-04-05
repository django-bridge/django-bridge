FROM node:18.18.2-bullseye-slim as dev

RUN userdel node && useradd __projectname__ -l --create-home && mkdir /app && chown __projectname__ /app

WORKDIR /app
USER __projectname__
