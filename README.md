### Asana-tools

This is a collection of tools for working with Asana.


#### Functionality

- OAuth2 authentication with Asana
- Creating mass tasks by parsing a CSV file and template task
- Creating a report of all tasks in a project during a given time period


#### Frontend

- Deploy

```shell
$ cd frontend
$ docker-compose up --build asana-tools-frontend
```

- Configuration

```dotenv
REACT_APP_BACKEND_URI=<your backend uri>
```

#### Backend

- Deploy

```shell
$ cd backend
$ docker-compose up --build asana-tools-backend
```

- Configuration

```dotenv
ASANA_CLIENT_ID=<your asana client id>
ASANA_CLIENT_SECRET=<your asana client secret>
JWT_SECRET_KEY=<your jwt secret key>
```
