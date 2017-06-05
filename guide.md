# Build and deploy your own full-stack JavaScript project from scratch with React and PostgreSQL

## Preconditions

This tutorial assumes only that you are able to use a text editor and a terminal (command line tool) on your computer. Familiarity with reading and writing JavaScript and SQL might be useful, but the instructions are meant to be detailed enough so that you can complete the tutorial even without knowing JavaScript or SQL yet.

If you get stuck you may refer to this project on GitHub which has a fully working example built with this guide: https://github.com/larsthorup/js-fullstack-sandbox

## Introduction

We will create a very simple web application that can display a list of things ("dreams") stored in a database. You will be able to run the application on your own computer while you are working on it, and you will later be able to deploy the application to the cloud so it can be accessed from other computers. 

The application will have a database, a back-end and a front-end. The database will use PostgreSQL, the back-end will use Express.js and the front-end will use React. We will use Zeit Now to deploy the application to the cloud.

## Database

We will use the ElephantSQL service to get a cloud hosted PostgreSQL database using their free tier. Sign up on:

    https://www.elephantsql.com/

When you have created a database instance, go to the "Browser" tab for the instance. Here you can create a table and insert some data by pasting this SQL script and executing it:

    drop table if exists dream;
    
    create table dream (
      id bigserial primary key,
      title varchar(255)
    );
    
    insert into dream (title) values ('Compose a tune');
    insert into dream (title) values ('Visit Zaire');
    insert into dream (title) values ('Write a sci-fi novel');

On the "Details" tab of the instance you can find the database URL which we will need in a moment.

## Back-end

Install the latest version of Node.js from

    https://nodejs.org/

Create a project directory somewhere on your computer and open a terminal in this directory, then create a `server` directory for the back-end code and initialize it with a `package.json` file:

    cd your-project-directory-name
    mkdir server
    cd server
    npm init --yes
    
Then install the tools that we will depend on for the back-end:
 
    npm install --save dotenv express fs-extra pg-promise
     
Then create a file with all the back-end code, called `server.js`:

    require('dotenv').config();
    const express = require('express');
    const pgp = require('pg-promise')();
    const db = pgp(process.env.DATABASE);
    const port = 3001; // Note: must match port of the "proxy" URL in app/package.json
    
    const app = express();
    
    async function dreamsGetHandler (request, response) {
      const dreamList = await db.map('select * from dream', [], a => a.title);
      response.send(dreamList);
    }
    app.get("/api/dreams", dreamsGetHandler);
    
    function listeningHandler () {
      console.log(`Server is listening on port ${port}`);
    }
    app.listen(port, listeningHandler);

Configure this file as the main entry point by adding the following line to the beginning of the `scripts` section of `package.json`:
                                               
   "start": "node server",

We tell the back-end to connect to our database using the URL we got on the ElephantSQL details page by creating a file called `.env`:

    DATABASE=your PostgreSQL connection URL

Since this file will contain the password, you should never commit this file, so let's make sure that Git will ignore it by listing that file name in a new file called `.gitignore`:

    .env

You can test the back-end by first starting the server:

    npm start

And then open this URL in a browser:

    http://localhost:3001/api/dreams

And it will return the data from our database as a JSON object:

    ['Compose a tune', 'Visit Zaire', 'Write a sci-fi novel']

When you change the back-end code, you will need to manually stop the server (`Ctrl+C`) and restart it (`npm start`).

## Front-end

We will create a front-end application in React. Front-end applications needs to be transpiled and bundled to work well in browsers, and we will use `create-react-app` to get a fully working setup of Webpack, Babel and other tools that handle this automatically. 

You will want to keep the back-end running in its own terminal, so open up a new terminal for working with the front-end.

First we install `create-react-app` globally.

    npm install -g create-react-app

Then we use it to create a skeleton app:

    cd your-project-directory-name
    create-react-app app

Getting all the tools installed takes a couple of minutes.

Then run the app in development mode:

    cd app
    npm start

This will open the app in a browser, and when you make changes to the source code of the app, Webpack ensures that it will automatically reload in the browser so you can see the effect of your changes.

We want our app to fetch and display data from our back-end. Let's create a React component in the file `src/DreamList.js`:

    import React, { Component } from 'react';
    
    class DreamList extends Component {
      constructor() {
        super();
        this.state = {
          dreamList: []
        };
      }
    
      async componentDidMount() {
        const response = await fetch('/api/dreams');
        const dreamList = await response.json();
        this.setState({dreamList});
      }
    
      render() {
        return (
        <div className="DreamList">
          <h3>All my dreams</h3>
          <ul>
          {this.state.dreamList.map(dream =>
            <li key={dream}>{dream}</li>
          )}
          </ul>
        </div>
        );
      }
    }
    
    export default DreamList;
 
We need to render this component inside the main App component, so we will add this line in `App.js` after the `<p>...</p>` element:

    <DreamList />

You will also need to add an import statement next to the other import statements at the top of the file:

    import DreamList from './DreamList';
 
During development the back-end runs on a different port (3001, served by Express) than the front-end (3000, served by WebpackDevServer). We need to tell WebpackDevServer to proxy back-end requests to our back-end, so we must add this line to `package.json` (right after the initial `{` character):

    "proxy": "http://localhost:3001",

Now, if you stop (pressing `Ctrl+C`) and then restart the front-end (`npm start`), you will see the list of dreams being displayed as a bullet list in the browser.

Congratulations: You now have a full-stack JavaScript application running on your computer!

## Deploy

To ensure that other people can use our application we need to bundle the front-end, ensure that the back-end will serve all the front-end files and upload the combined front-end and back-end code to the cloud.
  
First install `now` from zeit.co:

    npm install -g now
    now login

Follow the instructions to create an account with zeit.co.

Verify that `now` has been configured correctly by running

    now ls

It should tell you something like `0 deployments found under your-user-name`.

We will use the same Express-based back-end to serve the files of the front-end. We will need to bundle the front-end files and then copy the bundled results into the back-end folder. 

Add the following lines to the beginning of the `scripts` section of `server/package.json`:

    "app:build": "cd ../app && npm run build",
    "app:copy": "node copyApp",
    "build": "npm run app:build && npm run app:copy",

Also add a new file `server/copyApp.js`:

    const fs = require('fs-extra');
    fs.emptyDirSync('./app');
    fs.copySync('../app/build', './app');
    
You can now run this build step in a third terminal window with:

    cd your-project-directory-name/server
    npm run build

Then we need to write the code so the back-end will serve the bundled front-end files. Add this code to the end of `server/server.js`:

    app.use(express.static('app')); // Note: serve app as static assets
    app.get("/", function (request, response) { // Note: redirect root URL to index.html in app
      response.sendFile(__dirname + '/app/index.html');
    });

The last step will be to create the configuration for `now`. Add the following line to the beginning of the `scripts` section of `server/package.json`:

    "now-build": "echo already built",

Then add the following configuration in the same file right after the initial `{` character:
    
    "now": {
      "files": [
        "app",
        ".env",
        "server.js"
      ]
    },

You can now deploy your application to the cloud by running `now`:

    cd your-project-directory-name/server
    now --public

Your code will deployed to a newly created cloud server with a unique URL. You can find the URL in the output in a line that looks like this:
 
    > Ready! https://js-fullstack-sandbox-ruyyzimsfa.now.sh [2s]

On non-Windows machines, the URL should also automatically be in your clipboard for easy pasting.

Congratulations: Your application is now running in the cloud and is available from everywhere!

## Learn more

To extend your application you may need to learn more about how to use the tools we used. Here is a list of links to documentation and tutorials.

* [React tutorial](https://facebook.github.io/react/tutorial/tutorial.html)
* [React documentation](https://facebook.github.io/react/docs/hello-world.html) 
* [PostgreSQL documentation](https://www.postgresql.org/docs/current/static/index.html)
* [Express documentation](https://expressjs.com/en/4x/api.html)
* [Zeit Now documentation](https://zeit.co/docs/features/now-cli#)
* Modern JavaScript: [Learn ES-2015](https://babeljs.io/learn-es2015/)
