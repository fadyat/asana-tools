c := asana-tools-backend
container_id := $(shell docker ps | grep "${c}" | awk '{ print $$1 }')

up:
	docker-compose build $c && docker-compose up $c

down:
	docker-compose down

in:
	docker exec -it $(container_id) /bin/bash

kill:
	docker kill $(container_id)

api:
	python cli.py api --reload=true

v:
	@echo $(shell pip freeze | grep $(d))
