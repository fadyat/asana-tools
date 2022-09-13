## Start

```docker
docker-compose build {{service-name}} && docker-compose up {{service-name}}
```

## Scripts

> Перед запуском определенного скрипта, необходимо прокинуть
> переменные окружения в `.env` файл

- **app-likes**

  Подсчет лайков на задаче и выставление в кастомное поле
  ```dotenv
    ASANA_API_KEY=
    ASANA_LIKES_FIELD_ID=
    ASANA_TASK_TEMPLATE_URL=
  ```

- **app-mailing** 

  Создание задач на сотрудников из `{{file_name}}.csv`, по переданному шаблону задачи
  ```dotenv
    ASANA_API_KEY=
    ASANA_TASK_TEMPLATE_URL=
    DATA_CSV_FILE_NAME=
  ```
  
  - Поддерживаемые колонки:
  ```text
  email, equipment
  ```