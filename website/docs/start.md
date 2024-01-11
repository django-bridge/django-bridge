---
sidebar_position: 1
---

# Getting Started

## Using the project template

To start a new project, use the `create-djream` npm start template:

```
npm create djream myapp
```

This will generate a minimal project with Django, React, Djream, and Vite.

### Project structure

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

### Creating and starting a local development environment (using Docker Compose)

The root folder contains a ``docker-compose.yml`` that creates a local development environment and ``Makefile`` containing some shortcuts for docker compose.

Use the ``make setup`` command to create a new development environment, and ``make start`` to run it.

### Deploying the project

The Dockerfile in ``server`` can be used to build a container for hosting on a PaaS that supports Docker, such as: Heroku, Google Cloud Run, AWS Fargate, or Azure Container Apps.

To build a production container, build the server image fron the root folder using the ``prod`` target:

```
docker build -t myapp_prod --target prod -f server/Dockerfile .
```

Then you can deploy this Docker container to one of the above suggested services with the following environment variables set:

- ``DJANGO_SECRET_KEY`` to a random string to use for Django's [``SECRET_KEY`` setting](https://docs.djangoproject.com/en/5.0/ref/settings/#std-setting-SECRET_KEY).
- ``DJANGO_ALLOWED_HOSTS`` to a comma-separated list of domain names that the server will respond on.
- ``DATABASE_URL`` to a URL to the PostgreSQL database to use (in the format ``postgres://<username>:<password>@<host>:<port>/<database>``).

The built frontend bundle will be embedded in the image by the command above. To serve this, you will either need to extract it and upload to a static host like S3 or R2 and set Django's ``STATIC_URL`` to point at this location or [install WhitenNoise](https://whitenoise.readthedocs.io/en/latest/django.html) to serve the static bundle from the container.
