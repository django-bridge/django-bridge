---
sidebar_position: 1
---

# Starting a new project

Welcome to Django Render!

This section of the documentation is aimed at newcomers to Django Render.

We will start a new project and build a TODO list application using Django for the backend and React for the frontend.

## Prerequisites

Node.js - We will be using an `npm-start` template to start a new project
Docker or Python - The template includes docker-compose configuration, but you can also use Python directl


## Starting the project

To start a new project, use the `create-django-render` npm start template:

```
npm create django-render@latest todolist
```

This will generate a new project with Django, React, Django Render, and Vite.



## Project structure

Here's the structure of the project that this will crate.

```
/myapp
    /client
        /src
            /views/Home
                HomeView.tsx
            index.css
            main.tsx
            vite-env.d.ts
        package.json
        tsconfig.json
        Dockerfile
        vite.config.ts
    /server
        /myapp
            asgi.py
            settings.py
            wsgi.py
            urls.py
            views.py
        Dockerfile
        manage.py
        pyproject.toml
    docker-compose.yml
    Makefile
    README.md
```

The root folder contains ``client`` and ``server`` folders containing the React frontend and Django backend respectively.

## Creating and starting a local development environment (using Docker Compose)

The root folder contains a ``docker-compose.yml`` that creates a local development environment and ``Makefile`` containing some shortcuts for docker compose.

Use the ``make setup`` command to create a new development environment, and ``make start`` to run it.
