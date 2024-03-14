# A REST API For An Auction Smart Contract

## Built with 
- [nest.js](https://nestjs.com) and 
- [web3js](https://web3js.readthedocs.io/en/v1.10.0/)

The service provides RESTful APIs for managing and querying data related to a single auction contract. Authentication is required to access the APIs.

## Main Features
- [ ] **User Authentication**: Implement user authentication using JSON Web Tokens (JWT). Users
should be able to register, login, and logout.
- [ ] **Auction Operations**: The logged in user should be able to access endpoints for
  - [ ] **Auction Status**: retrieve details of the auction (e.g., current highest bid, auction
status)
  - [ ] **Auction History**: List of all bids so far
  - [ ] **Submit a Bid**: Allow a user to submit a bid in a secure manner
    - [ ] Show an error message when the submitted bid amount is less than the
highest bid amount
  - [ ] **Statistics**: Show total number of bids made and total ETH volume

## Extra Features

- [ ] Implement an endpoint to deploy a new auction smart contract with parameters being the
end time and the beneficiary wallet address.
- [ ] Dockerize the entire set up, make the API fault-tolerant and ensure that the whole project
- [ ] runs with just docker-compose
- [ ] Add at least 1 complete unit and 1 integration test
- [ ] Automated pipeline to build Docker images and run tests. You can also make it a part of theAnd
- [ ] PR workflow

## How to use
### Relevant links
> **Base URL** => \<insert-live-link> <br>
  **Postman doc** => \<insert-postman-doc-link> <br>
  **Documentation Video** => \<link-to-documentation-video>
- Auth
  - register
    > POST /api/v1/register
  - login
    > POST /api/v1/login
  - logout
    > DELETE /api/v1/logout
- Auction (protected routes -- requires a bearer \<token> as  `Authorization` header in request)
  - auction status
    > GET api/v1/auction/statusPOST
  - auction history
    > GET api/v1/auction/history
  - submit bid
    > POST api/v1/auction/submit-bid
  - statistics
    > GET api/v1/auction/statistics