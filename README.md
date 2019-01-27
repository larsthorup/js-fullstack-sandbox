# js-fullstack-sandbox

This project is a working example of a simple full stack JavaScript application using PostgreSQL, Express.js and React. You can create your own project from scratch by following [the guide](https://www.fullstackagile.eu/2017/06/04/js-sql-fullstack-guide/).

## initial setup

    # database
    # configure a PostgreSQL instance, e.g. on elephantsql.com
    # create server/.env from .env-sample and set DATABASE 

    # hosting with zeit.co
    npm install -g now
    now login

    # node.js dependencies
    cd app
    npm install
    cd ../server
    npm install


## database

    # run `recreate.sql` on the instance

## run locally

Use two terminals:

1:

    cd server
    npm start

2:

    cd app
    npm start


## deploy

    cd server
    npm run build
    now
