.PHONY: up down build migrate test lint logs shell setup

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

migrate:
	docker compose exec backend alembic upgrade head

test:
	cd backend && poetry run pytest --cov=app --cov-report=term-missing -v

lint:
	cd backend && poetry run ruff check app/ tests/

logs:
	docker compose logs -f backend

shell:
	docker compose exec backend bash

setup:
	cp .env.example .env
	docker compose build
	docker compose up -d
	sleep 8
	docker compose exec backend alembic upgrade head
	@echo "Ready — API: http://localhost:8000/docs  UI: http://localhost:3000"
