# A REST API For An Auction Smart Contract

## Built with 
- [nest.js](https://nestjs.com) and 
- [web3js](https://web3js.readthedocs.io/en/v1.10.0/)

### Relevant links
> [**Base URL**](https://web3-auction-api-latest.onrender.com)<br>
  [**Postman doc**](https://documenter.getpostman.com/view/20767794/2sA2xpRobz) <br>
  [**Documentation Video**](<link-to-documentation-video>)

The service provides RESTful APIs for managing and querying data related to a single auction contract. Authentication is required to access the APIs.

## Main Features
- [X] **User Authentication**: Implement user authentication using JSON Web Tokens (JWT). Users
should be able to register, login, and log out.
- [X] **Auction Operations**: The logged-in user should be able to access endpoints for
  - [X] **Auction Status**: retrieve details of the auction (e.g., current highest bid, auction
status)
  - [X] **Auction History**: List of all bids so far
  - [X] **Submit a Bid**: Allow a user to submit a bid in a secure manner
    - [X] Show an error message when the submitted bid amount is less than the
highest bid amount
  - [X] **Statistics**: Show the total number of bids made and total ETH volume

## Extra Features

- [X] Implement an endpoint to deploy a new auction smart contract with parameters being the
end time and the beneficiary wallet address.
- [X] Dockerize the entire setup, make the API fault-tolerant, and ensure that the whole project runs with just `docker-compose`
- [X] Add at least 1 complete unit and 1 integration test
- [X] Automated pipeline to build Docker images and run tests. You can also make it a part of the PR workflow

## Getting Started
Follow the follwing procedure to get this repo setup locally.

### Step 1 - Clone
```bash
git clone https://github.com/de-marauder/aguadolce-backend-assignment.git
```

### Step 2 - Install docker
> For this refer to the [Official docs](https://docs.docker.com/engine/install/)

### Step 3 - Setup `ENV` files
> If you'll be making use of containers (advised), you can specify the database container name as a domain name and docker will automatically resolve it to the container IP for containers in the same network. See [docker-compose file](./docker-compose.yml) for configuration information.

Three env files are required. 
- `.env`: This file contains the environment variables for development and production environments
  ```
  NODE_ENV="development"
  PORT=

  DEV_DATABASE=mongodb://<api-user>:<api-user-password>@mongo-dev:27017/api

  TEST_DATABASE=mongodb://<api-test-user>:<api-test-user-password>@mongo-test:27017/test
  
  PRODUCTION_DATABASE=mongodb://<api-prod-user>:<api-prod-user-password>@mongo-prod:27017/api-prod
  
  JWT_EXPIRE=
  TOKEN_SECRET=<super-secret-secret>
  WEB3_PROVIDER_URL=
  WEB3_PRIVATE_KEY=
  WEB3_DEFAULT_ADDRESS=
  ```
- `.env.test`: This file contains the environment variables for testing environments
  ```
  NODE_ENV="test"
  PORT=
  
  DEV_DATABASE=mongodb://<api-user>:<api-user-password>@mongo-dev:27017/api
  
  TEST_DATABASE=mongodb://<api-test-user>:<api-test-user-password>@mongo-test:27017/test
  
  PRODUCTION_DATABASE=mongodb://<api-prod-user>:<api-prod-user-password>@mongo-prod:27017/api-prod
  
  JWT_EXPIRE=
  TOKEN_SECRET=<super-secret-secret>
  WEB3_PROVIDER_URL=
  WEB3_PRIVATE_KEY=
  WEB3_DEFAULT_ADDRESS=
  ```

- `.env.db`: This file contains the environment variables for mongo container environments. These values are used to configure container databases for different environments if you choose to use containers. See [mongo-init script](./mongo-init.sh) for more information on how they are used.
  ```
  MONGO_INITDB_ROOT_bashUSERNAME=<api-user>
  MONGO_INITDB_ROOT_PASSWORD=<password>
  bash
  # dev
  MONGO_INITDB_ROOT_DATABASE=<api>
  API_DB=<api>
  API_DB_USER=<api-user>
  API_DB_PASSWORD=<api-user-password>
  
  # test
  MONGO_INITDB_ROOT_DATABASE=<test>
  API_TEST_DB=<test>
  API_TEST_DB_USER=<api-test-user>
  API_TEST_DB_PASSWORD=<api-test-user-password>
  
  # production
  MONGO_INITDB_ROOT_DATABASE=<api-prod>
  API_PROD_DB=<api-prod>
  API_PROD_DB_USER=<api-prod-user>
  API_PROD_DB_PASSWORD=<api-prod-user-password>
  ```

### Step 4 - Start API
If using containers,
- Start in dev mode: `yarn start:docker:dev`
- Start in prod mode: `yarn start:docker:prod`
- For tests, There are 3 types of tests you can run
  - Unittests: `yarn test`
  - Integration tests: `yarn test:int`
  - End-to-end tests: `yarn test:e2e`

If using normal mode,
- Start in dev mode: `yarn start:dev`
- Start in prod mode: `yarn start:prod`
- For tests, There are 3 types of tests you can run
  - Unittests: `yarn test`
  - Integration tests: `yarn test:int`
  - End-to-end tests: `yarn test:e2e`

See [package.json](./package.json) for the above configurations

## How to use

- Auth
  - register
    > POST /api/v1/auth/register
  - login
    > POST /api/v1/auth/login
  - logout
    > DELETE /api/v1/auth/logout
- User
  - verify
    > POST /api/v1/user/verify
- Auction (protected routes -- requires a bearer \<token> as  `authorization` header in request)
  - Request unsigned deploy auction contract transaction
    > POST /api/v1/auction/request-unsigned-deployment-transaction
  - Save signed deploy auction contract transaction
    > POST /api/v1/auction/Save-signed-deployment-transaction
  - Auction status
    > GET api/v1/auction/:auctionId/status
  - Auction history
    > GET api/v1/auction/:auctionId/history
  - Request unsigned bid
    > GET api/v1/auction/:auctionId/request-unsigned-bid
  - Save signed bid
    > POST api/v1/auction/:auctionId/save-signed-bid
  - Statistics
    > GET api/v1/auction/:auctionId/statistics

Please refer to the [**Postman doc**](https://documenter.getpostman.com/view/20767794/2sA2xpRobz) for more details

  
