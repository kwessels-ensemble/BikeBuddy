# BikeBuddy

An app for riders (MTB, Gravel, Road) to plan and join rides in their area.

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

## Project Structure/Code Organization

The project follows Next.js app/ directory structure.

- Configuration files (and .env file) live in the root directory.
- All other files live in /src.
- Auth and db connection files live in /src/lib.
- Model files live in /src/models.
- Middleware is in /src.
- Reusable UI components are stored in /src/components.
- All other app code lives in /src/app.
- The layout file lives in /src/app/layout.js, and the homepage lives in /src/app/page.js.
- A global css file lives in /src/app/global.css. All other css files are scoped to a specific page or component and live with the corresponding page or component location and naming convention `<filename>.module.css`, where `<filename>` matches the page or component name.
- All api routes live in /src/app/api, and code is in 'route.js' files, which are within the folders with folder path matching the api route.
- Shared state lives in /src/app/context.
- UI pages, like 'ride-feed' for example, live in their own folder within /src/app (example- src/app/ride-feed), and UI code is in files named 'page.jsx' within folders with folder path matching the page's url.

Here is a snapshot of the general directory structure -


    ├── src
    │   ├── app #next.js app dir (routes, layouts, styles)
    │   │   ├── api/ #all api routes
    │   │   ├── login/ #login page
    │   │   ├── ride-feed/ #public ride feed pages
    │   │   ├── saved-rides/ #saved ride pages
    │   │   ├── scheduled-rides/ #scheduled ride pages
    │   │   └── signup/ #signup page
    │   │   ├── page.js #home page

    │   │   ├── context/ #global context (authcontext)
    │   │   ├── global.css #global css
    │   │   ├── layout.js #root layout shared across pages

    │   ├── components
    │   │   ├── Nav/ #nav bar and logout button
    │   │   ├── Rides/ #ride-related forms, cards, details
    │   │   └── Spinner/ #loading spinner

    │   ├── helpers/ #helper functions
    │   ├── lib/ #utility functions and db connection
    │   ├── models/ #mongoose db models
    │   └── schemas/ #mongoose db schemas
    │   ├── __tests__/ #unit and integration tests (vitest)
    │   ├── middleware.js #next.js middleware for auth/routing

    ├── public/ #static assets
    ├── .env #env variables
    ├── vitest.config.js #vitest configuration
    ├── eslint.config.mjs #eslint rules
    ├── next.config.mjs #next.js config
    ├── package.json #dependencies


### Testing

Testing is implemented with vitest. Test files live in `/src/__tests__` Note that backend tests are in `/src/__tests__/api`, and front end tests are in `/src/__tests__/app` and `/src/__tests__/components`. Note the file setup.js that includes a number of mocks that are used to assist with mocking db operations, api calls, and related authentication and encryption functions for testing.

Tests can be run with the following -

    $ npm run test

You can run a single test with -

    $ npm run test <testfilename.test.js>

Note that during MVP development, the focus was on building out core functionality and validating the end-to-end flow of the app. As a result, automated test coverage is currently limited to a few critical routes and components.

The next stage of development will include expanding unit and integration test coverage.

## Deployment

The app is currently deployed on vercel (https://bikebuddy-dev.vercel.app/).

## MVP Summary
- Riders can create an account and securely access the BikeBuddy app.
- Riders can add, edit, delete rides into their personal "Saved Rides" collection for planning.
- Riders can schedule rides, either with details from an existing "Saved Ride" or by entering details on the fly. Riders can add, edit, and cancel their "Scheduled Rides".
- Scheduled rides can be made public or private. If public, they will appear on the "Ride Feed" for other riders.
- Riders can scroll through the "Ride Feed" to view upcoming public rides. They can "Join" or "Leave" public rides.

## V1 and Next Steps

Small improvements are planned for the current version of the app, including -
- Improved styling, including compatibility and improvements for experience viewing app on a phone.
- Filters for the ride feed and easy navigation and tracking of rides you're "attending" or that you're the organizer of.


Other planned improvements include -
- Adding ride meeting location field with an option for a link to ride meet up location pin.
- Allowing photo upload for a ride.
- Further building out the existing ride "location" functionality to allow for more location selections and filtering by location or distance (likely integrating an external api).
- Adding notifications for rides a user is "attending" (like reminders or any cancellations or changes to ride details).
- Building out a basic profile page with user summary and photo (with small photo/avatar to be used in ride feed).
- Add a calendar/scheduling tool to make it easier for users to view their ride "calendar", including all rides they've scheduled or are attending.
- Add gpx upload option for rides and map preview.
- Allow participants to add comments to a scheduled ride.
- Additional user auth functions, like verifying user via email and forgot user/password support.


