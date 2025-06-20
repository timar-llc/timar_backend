run-dev:
	docker compose -f ./docker-compose.dev.yaml up --build 

run-prod:
	docker compose -f ./docker-compose.prod.yaml --env-file .env.build up --build

stop-dev:
	docker compose down

stop-prod:
	docker compose down -v