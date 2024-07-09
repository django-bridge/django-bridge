FROM node:18.18.2-bullseye-slim as dev

RUN userdel node && useradd __projectname__ -l --create-home && mkdir /client && chown __projectname__ /client

WORKDIR /client
USER __projectname__
