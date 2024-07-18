.PHONY: setup rebuild migrate superuser start

setup: rebuild migrate ## Sets up development environment
	docker compose run client npm install

rebuild: ## Rebuilds the docker containers
	docker compose pull
	docker compose build

migrate: ## Run Django migrations
	docker compose run server django-admin migrate

superuser: ## Create a superuser
	docker compose run server django-admin createsuperuser

start: ## Starts the docker containers
	docker compose up
