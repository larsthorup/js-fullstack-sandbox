# js-fullstack-sandbox

## database

    # configure a PostgreSQL instance, e.g. on elephantsql.com
    # run `recreate.sql` on the instance

## app

    cd app
    npm install
    npm start

## server

    # create .env from .env-sample and set DATABASE 
    cd server
    npm install
    npm start

## run locally

    # start app
    # start server
    # open http://localhost:3000/

## deploy

    cd app
    npm run build
    # todo: copy app/build/* to server/...
    # todo: now
    # todo: open site