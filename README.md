# js-fullstack-sandbox

This project is a working example of a simple full stack JavaScript application using PostgreSQL, Express.js and React. You can create your own project from scratch by following [the guide](https://www.fullstackagile.eu/2017/06/04/js-sql-fullstack-guide/).

## initial setup

    # database
    # configure a PostgreSQL instance, e.g. on elephantsql.com
    # create server/.env from .env-sample and set DATABASE 

    # hosting with Netlify
    npm install -g netlify-cli
    netlify login
    netlify status # to get your team name, such as lars-1234567
    netlify sites:create --name dreams-lars-1234567 --account-slug lars-1234567
    netlify link --name dreams-lars-1234567

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
    netlify dev

2:

    cd app
    npm start


## deploy

    cd app
    npm run build
    cd ..
    netlify deploy --prod
    netlify open:site
