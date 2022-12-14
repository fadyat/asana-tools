## Asana-tools

This is a collection of tools for working with Asana.

### Functionality

- OAuth2 authentication with Asana
- Creating mass tasks by parsing a CSV file and template task
- Creating a report of all tasks in a project during a given time period

### Before deploy

- Create a new Asana app at https://app.asana.com/-/account_api
- Set the redirect URI, example: `http://localhost:80/api/v1/callback`
- Set the environment variables `ASANA_CLIENT_ID` and `ASANA_CLIENT_SECRET` to the values from the Asana app

### Deploy

#### Backend

- Make `.env` file with the following variables:

  ```dotenv
  ASANA_CLIENT_ID=<your asana client id>
  ASANA_CLIENT_SECRET=<your asana client secret>
  JWT_SECRET_KEY=<your generated uuid>
  ```

- Build and run container:

    ```shell
    $ cd backend
    $ docker-compose up --build asana-tools-backend
    ```

#### Frontend

- Make `.env` file with the following variables:

  ```dotenv
  REACT_APP_BACKEND_URI=<your base backend uri> // http://localhost:80/api/v1/
  REACT_APP_BACKEND_URI_REDIRECT_ENDPOINT=<public redirect endpoint> // http://localhost:80/api/v1/callback
  REACT_APP_ASANA_CLIENT_ID=<your asana client id>
  ```

- Build and run container:

  ```shell
  $ cd frontend
  $ docker-compose up --build asana-tools-frontend
  ```

#### Usage

- Go to frontend url, for example: `http://localhost:3000/`
- Click login button and follow the instructions 


