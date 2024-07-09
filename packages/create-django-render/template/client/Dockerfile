FROM node:18.18.2-bullseye-slim as dev

ARG UID=1000
RUN userdel node && useradd __projectname__ --uid ${UID} -l --create-home && mkdir /client && chown __projectname__ /client

WORKDIR /client
USER __projectname__
