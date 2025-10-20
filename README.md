# BikeBuddy

An app for bikers (MTB, Gravel, Road) to plan and join rides in their area.

## Requirements

For development, you will need Node.js (including npm) installed locally.

### Install Node

Install from https://nodejs.org. Verify installation with the following commands -

    $ node -v
    $ npm -v

### Clone Repository

    $ git clone https://github.com/kwessels-ensemble/BikeBuddy.git

### Install Dependencices

    $ cd BikeBuddy
    $ npm install

Note this will create a node_modules folder with all the dependencies the app needs.

### Create a mongodb atlas account and cluster

    https://cloud.mongodb.com/

After creating a cluster, click "connect with mongodb driver", select node.js, and copy the connection string (noting that you'll need to replace the <db_password> and add the <db_name> in the connection string).

Note- you can test your connection string using mongodb compass.

Note- you'll need to copy the mongodb connection string/uri to use in the next step.

### Set up environment variables

Create a .env file within the root project dir with the following required environment variables -

    JWT_SECRET = '<your_jwt_secret>'
    MONGODB_URI = '<your_mongodbatlas_connection_uri>'

### Once everything is set up, start the app

    $ npm run dev

This will run Next.js in dev mode (at http://localhost:3000).

You can now modify files and the local dev server will reflect any changes.

### Testing

Testing is implemented with vitest. Test files live in /src/__tests__ Note that backend tests are in /src/__tests__/api, and front end tests are in /src/__tests__/app and /src/__tests__/components. Note the file setup.js that includes a number of mocks that are used to assist with mocking db operations, api calls, and related authentication and encryption functions for testing.

Tests can be run with the following -

    $ npm run test

You can run a single test with -

    $ npm run test <testfilename.test.js>

Note that during MVP development, the focus was on building out core functionality and validating the end-to-end flow of the app. As a result, automated test coverage is currently limited to a few critical routes and components.

The next stage of development will include expanding unit and integration test coverage.

## Deployment



## MVP Goals
- Riders can create an account and securely access the BikeBuddy app.
- Riders can add, edit, delete rides into their personal "Saved Rides" collection for planning.
- Riders can schedule rides, either with details from an existing "Saved Ride" or by entering details on the fly. Riders can add, edit, and cancel their "Scheduled Rides".
- Scheduled rides can be made public or private. If public, they will appear on the "Ride Feed" for other riders.
- Riders can scroll through the "Ride Feed" to view upcoming public rides. They can "Join" or "Leave" public rides.

## Note on v1 and next steps



