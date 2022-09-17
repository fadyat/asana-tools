## Start

```docker
docker-compose build {{service-name}} && docker-compose up {{service-name}}
```

## Scripts

> Перед запуском определенного скрипта, необходимо прокинуть
> переменные окружения в `.env` файл

- **app-mailing** 

  Создание задач на сотрудников из `{{file_name}}.csv`, по переданному шаблону задачи
  ```dotenv
  ASANA_API_KEY=
  ASANA_PROJECT_URL=
  DATA_CSV_FILE_NAME=
  ```
