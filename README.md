# FoodTography
	
Looking for places to eat is always a challenge, especially when traveling or visiting new places. Although there are services that exist to look at reviews of restaurants and restaurants in the surrounding area, these are not targeted towards looking for places to eat at and getting a sense of the experience of eating at these restaurants due to the lack of images. FoodTography's focus is to solve this problem by creating an interactive environment where users can share their experiences at the restaurant through images and comments.

FoodTography is a web appliciation focus on helping people find restaurants to eat at by using images that people post that highlights not just the food but their experience there. The application will allow users to search for restaurants at a certain location. Users can then select a restaurant to see posts based on the location's food or atmosphere, allowing users to get a better sense of the the overall atmosphere of the place. Users can posts and share images of experiences at restaurants. The posts will consist of the image of the restaurant, a description, and the location of the restaurant.


This project was created with [React](https://github.com/facebook/create-react-app), [Node.js](https://nodejs.org/en/docs/), [GraphQL](https://graphql.org/), [MongoDB](https://www.mongodb.com/), [Redis](https://redis.io/), [AWS](https://aws.amazon.com/), [ImageMagick](https://imagemagick.org/index.php), and [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview).


## How to Run
1. [Install Node version 12](#how-to-install-node-version-12)
2. [Set up Client](#client)
3. [Set up Server](#server)

## Client
***Note: Latest version of Node is not compatible with Client.***
In order to avoid this issue [Install Node version 12](#how-to-install-node-version-12) in client console.

***`.env` file must be in client directory*** in order to have access to the Fire base Authentication.

Technology used [React](https://github.com/facebook/create-react-app).

**Steps**
1. `cd client`
2. [Install Node version 12](#how-to-install-node-version-12)
3. `.env file exist in client directory`
4. `npm install`
6. `npm start`

### `npm install`
Installs all the module dependencies for the client.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


## Server
***Note: At latest, any version Node version 12 must be used*** because of the compatiblity issues of uploading to AWS S3 with GraphQL.

***`.env` file must be in server directory*** in order to have access to the Google Places API calls.

Technologies used [Node.js](https://nodejs.org/en/docs/), [Redis](https://flaviocopes.com/redis-installation/), [MongoDB](https://www.mongodb.com/docs/manual/tutorial/getting-started/), [GraphQL](https://graphql.org/), [AWS](https://aws.amazon.com/), and [ImageMagick](https://imagemagick.org/index.php).

**Steps**
1. `cd server`
2.  [Set up Redis](#redis)
3.  [Set up MongoDB](#mongodb)
4.  [Install Imagemagick](#imagemagick)
5. `.env file exist in server directory`
6. [Install Node version 12](#how-to-install-node-version-12)
7. `npm run seed`
8. `npm install`

### `Imagemagick`
Install [Imagemagic](https://imagemagick.org/script/download.php).

If on a windows machine, imagemagick module has a known bug which makes it unable to read the PATH variable from ENVIRONMENT. In order to resolve this issue manually set the path to default windows location. If it throws Error: spawn identify ENOENT then you may have to set the correct location to `convert.exe` and `identify.exe` binaries which is relative to your machine in `./server/index.js` file

### `Redis`
Set up and run [Redis](https://flaviocopes.com/redis-installation/).

### `MongoDB`
Set up and run [MongoDB](https://www.mongodb.com/docs/manual/tutorial/getting-started).

### `npm install`
Installs all the module dependencies for the server.

### `npm run seed`
Seed the data into MongoDB.

### `npm start`

Starts the Server.\
Open [http://localhost:4000](http://localhost:4000) to view GraphQL in your browser.

## How to Install Node Version 12
1. To install Node Version 12, install [nvm](https://github.com/nvm-sh/nvm)
2. To switch to Node Version 12 type  `nvm use 12` in your console
3. To check for correct Node Version type `node -v` in your console 



