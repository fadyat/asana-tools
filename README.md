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
  # Omit all '/' at the end of the url, example: http://localhost:80 
  REACT_APP_ASANA_TOOLS_HOST=<your backend host>
  REACT_APP_HELPSHIFT_ALERTS_HOST=<your helpshift alerts host>
  
  # It's not secure to store the api key in the frontend, but it's a temporary solution
  REACT_APP_HELPSHIFT_API_KEY=<your helpshift api key>
  REACT_APP_VERSION=<your version> 
  ```

- Build and run container:

  ```shell
  $ cd frontend
  $ docker-compose up --build asana-tools-frontend
  ```

#### Usage

- Go to frontend url, for example: `http://localhost:3000/`
- Click login button and follow the instructions 


