---
sidebar_position: 10
---

# Deploying

The Dockerfile in ``server`` can be used to build a container for hosting on a PaaS that supports Docker, such as: Heroku, Google Cloud Run, AWS Fargate, or Azure Container Apps.

To build a production container, build the server image fron the root folder using the ``prod`` target:

```
docker build -t myapp_prod --target prod -f server/Dockerfile .
```

Then you can deploy this Docker container to one of the above suggested services with the following environment variables set:

- ``DJANGO_SECRET_KEY`` to a random string to use for Django's [``SECRET_KEY`` setting](https://docs.djangoproject.com/en/5.0/ref/settings/#std-setting-SECRET_KEY).
- ``DJANGO_ALLOWED_HOSTS`` to a comma-separated list of domain names that the server will respond on.
- ``DATABASE_URL`` to a URL to the PostgreSQL database to use (in the format ``postgres://<username>:<password>@<host>:<port>/<database>``).

The built frontend bundle will be embedded in the image by the command above. To serve this, you will either need to extract it and upload to a static host like S3 or R2 and set Django's ``STATIC_URL`` to point at this location or [install WhiteNoise](https://whitenoise.readthedocs.io/en/latest/django.html) to serve the static bundle from the container.
