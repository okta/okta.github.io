---
layout: blog_post
title: "Build a Simple CRUD Application with Node and MySQL"
author: ivo-katunaric
description: "Learn to build a simple CRUD application using Node.js and MySQL"
tags: [ node, nodejs, express, expressjs, mysql, crud ]
tweets:
- "Build a secure Yelp-style CRUD application using Node.js and MySQL ➡"
- "Learn to build a simple CRUD application using Node.js and MySQL ➡"
image: blog/featured/okta-node-tile-books-mouse.jpg
---

`NodeJS` + `Express` is a popular technology stack for building APIs and backend services. Often times a backend database is required. There are several popular relational databases used in both enterprise and hobby projects. MySQL's spike in popularity came with the rise of PHP during the early 2000s and today - more than 20 years after the initial release - it's used on a wide array of technology stacks.

In this post, you'll learn how to build a basic CRUD (Create, Read, Update, Delete) application and secure the application using Okta. You'll be making a simple Yelp-style backend to rate restaurants called "FeedMeWell." Every restaurant will have a list of dishes it offers, and all registered users will be able to rate the restaurants. The system will then calculate the average rating for each restaurant based on the ratings.

Please note that you shouldn't read this blog post on an empty stomach!

> - `NodeJS` version 8+ (although these instructions should work with any version)
> - `docker` and `docker-compose` (A light layer of virtualized Linux machine you'll be using to run the `MySQL` server)
> - [A free `Okta` developer account](https://developer.okta.com/signup/) for easy authentication

That's everything you'll need to set up and run the project!

During the `npm install` phase, you will install the following dependencies:

- `TypeScript` (Typed superset of `JavaScript`)
- `TypeORM` (Object Relational Mapper for `TypeScript` and `JavaScript`)
- `Express` (Fast, unopinionated, minimalist web framework for Node)

## Initialize the Node + Express Project and Add Dependencies

Open a terminal and cd into a directory where you want your project created.

For example:

```bash
mkdir feed-me-well
cd feed-me-well
npm init --yes # This will create a package.json file used for dependency management.
npm install @okta/jwt-verifier@1.0.0 @okta/oidc-middleware@2.0.0 body-parser@1.19.0 dotenv@8.0.0 express@4.17.1 express-session@1.16.2 express-with-json@0.0.6 glob@7.1.4 mysql@2.17.1 reflect-metadata@0.1.13 ts-node@8.3.0 typeorm@0.2.18 typescript@3.5.3
npx ts-typie # This will add TypeScript types for all the dependencies that manage their typings separately in `https://github.com/DefinitelyTyped/DefinitelyTyped` repo)
```

## Create a Virtual `MySQL` Docker Machine

To avoid polluting your development machine with all the dependencies, use `docker-compose` to set up a database for development purposes.

To do this, create a `docker-compose.yml` file that defines the kinds of virtual machines your project requires. This project only requires one docker container for `MySQL`.

```yaml
version: '3.1'

services:
 okta-feed-me-well-db:
   container_name: okta-feed-me-well-db
   image: mysql
   command: --default-authentication-plugin=mysql_native_password
   restart: always
   ports:
     - 3389:3306
   environment:
     MYSQL_ROOT_PASSWORD: example
     MYSQL_DATABASE: okta-feed-me-well-db
     MYSQL_USER: user
     MYSQL_PASSWORD: password
```

Please note that you should use a more secure password if you create a production `MySQL` environment from this docker file.

After creating that `docker-compose.yml` file, you can start the virtual machine by running this command in the project root directory:

```bash
docker-compose up -d
```

Depending on your internet connection speed, the first run might take some time to download the `mysql`  docker image.

All later re-runs will be much faster.

## Define the run environment for your app

Even though all the info on the database already exists in the `docker-compose.yml` file, you now need to provide that information to the server.

To do this, create a `.env` file in the root of the project:

```dotenv
DB_PORT=3389
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=okta-feed-me-well-db
```

You now need to tell `TypeORM` how to connect to the `MySQL` database you just created. To do this,  create an `ormconfig.js` file:

```javascript
require('dotenv/config'); // load everything from `.env` file into the `process.env` variable

const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

module.exports = [{
 name: 'default',
 type: 'mysql',
 host: 'localhost',
 port: DB_PORT,
 username: DB_USERNAME,
 password: DB_PASSWORD,
 database: DB_DATABASE,
 synchronize: true,
 entities: [
   "src/models/*.ts"
 ],
 subscribers: [
   "src/subscribers/*.ts"
 ],
 migrations: [
   "src/migrations/*.ts"
 ],
 cli: {
   entitiesDir: "src/models",
   migrationsDir: "src/migrations",
   subscribersDir: "src/subscribers"
 }
}];
```

### Create a Node.js  Entry File

The entry point for the backend is `server.js` so you can run the server using the `npm start` command.

The file will load all the environmental variables from `.env` into `process.env` and set up the project for dynamic transpilation.

This is what the `server.js` should look like:

```javascript
require('dotenv/config');
require('reflect-metadata');
require('ts-node/register');

require('./src/bootstrap.ts')
  .bootstrap()
  .catch(console.error);
```

File `./src/bootstrap.ts` boots the server. To make this process possible, you must create `tsconfig.json` in the project's root:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "noImplicitAny": false,
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

## Add User Authentication to Your Node.js app with Okta

Okta is a free API service that allows you to create users, handle user authentication,  authorization, multi-factor authentication and more quickly and easily. By using Okta, you avoid writing time-consuming and potentially insecure authentication logic yourself.

Sign up for a [forever-free developer account](https://developer.okta.com/signup/) and then continue below.

Once you create your Okta account and log into your Okta dashboard, click on the **Applications** menu item. Then click **Add Application**. From the app creation wizard, select **Web**, and then click **Next**.

On the **Application Settings** screen, give your application a name and copy in the following app settings:

{% img blog/build-crud-app-node-mysql/feedmewell-okta-settings.png alt:"FeedMeWell Application Settings" width:"800" %}{: .center-image }

Once complete, scroll down and take a look at the **Client Credentials**. You're going to need this information shortly to integrate your web app with Okta. These settings (your Client ID and Secret) are your application's OpenID Connect credentials.

Reopen your `.env` file and append these values:

```dotenv
OKTA_ORG_URL=https://{yourOktaDomain}
OKTA_CLIENT_ID={yourClientId}
OKTA_CLIENT_SECRET={yourClientSecret}
APP_SECRET=secret
```

## Interface with Okta's authentication service

To provide information about the user that's making a request and to protect the server from unwanted requests, we'll create two Express middlewares to delegate that job to Okta's authentication service.

Export those middlewares (`initializeAuthentication` and `authenticateUser`) from the `src/services/okta.ts` file:

```typescript
import session from 'express-session';
import express from 'express';
import { ExpressOIDC } from '@okta/oidc-middleware';
import OktaJwtVerifier from '@okta/jwt-verifier';
import { JsonErrorResponse } from 'express-with-json';
// import { assertUser } from './user'; // we're going to need this import later

const issuer = `${process.env.OKTA_ORG_URL}/oauth2/default`;

export function initializeAuthentication(app: express.Application, port: number) {
 const oidc = new ExpressOIDC({
   issuer,
   client_id: process.env.OKTA_CLIENT_ID,
   client_secret: process.env.OKTA_CLIENT_SECRET,
   appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${port}`,
   scope: 'openid profile'
 });

 app.use(session({
   secret: process.env.APP_SECRET,
   resave: true,
   saveUninitialized: false
 }));
 app.use(oidc.router);

 app.get('/', oidc.ensureAuthenticated(), (req: any, res) => {
   res.send(req.userContext.tokens.access_token);
 });

 return oidc;
}

const oktaJwtVerifier = new OktaJwtVerifier({
 issuer,
 clientId: process.env.OKTA_CLIENT_ID
});

export async function authenticateUser(req: express.Request) {
 const { authorization } = req.headers;
 if (!authorization) {
   return;
 }

 const [authType, token] = authorization.split(' ');
 if (authType !== 'Bearer') {
   throw new JsonErrorResponse({ error: 'Expected a Bearer token' }, { statusCode: 400 });
 }

 const { claims: { sub } } = await oktaJwtVerifier.verifyAccessToken(token, 'api://default');
 // req.user = await assertUser(sub); // we're going to use this line as soon as we define User model
}

export async function requireUser(req: express.Request) {
 if (!req.user) {
   throw new JsonErrorResponse({ error: 'You must send an Authorization header' }, { statusCode: 400 });
 }
}
```

## Bootstrap Your Express Server

With authentication ready, you can now bootstrap the server. The bootstrap logic contains:

- a function to load all of the project's controllers
- a generic error handler
- a persistent connection to the `MySQL` database
- an `Express` server instance
- a handler for `TypeORM`'s "EntityNotFound" exception

That last one is useful to avoid having to handle an `EntityNotFound` situation in every request handler.

To make it all happen, create a new file called `src/bootstrap.ts`:

```typescript
import { createConnection } from 'typeorm';
import express from 'express';
import withJson from 'express-with-json'
import glob from 'glob';
import path from 'path';
import bodyParser from 'body-parser';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { authenticateUser, initializeAuthentication } from './services/okta';

const port = 3000;

function findAllControllers() {
 return glob
   .sync(path.join(__dirname, 'controllers/*'), { absolute: true })
   .map(controllerPath => require(controllerPath).default)
   .filter(applyController => applyController);
}

function errorHandler(error, req, res, next) {
 if (!error) {
   return next();
 }


 if (error) {
   res.status(500);
   res.json({ error: error.message });
 }
 console.error(error);
}

export function entityNotFoundErrorHandler(error, req, res, next) {
 if (!(error instanceof EntityNotFoundError)) {
   return next(error);
 }

 res.status(401);
 res.json({ error: 'Not Found' });
}

export async function bootstrap() {
 await createConnection();
 const app = withJson(express());
 app.useAsync(authenticateUser);
 app.use(bodyParser.json());
 initializeAuthentication(app, port);

 findAllControllers().map(applyController => applyController(app));
 app.use(entityNotFoundErrorHandler);
 app.use(errorHandler);

 app.listen(port, () => console.log('Listening on port', port));

 return app;
}
```

After creating the `bootstrap.ts` file, you can now run the server like so:

```bash
npm start
```

Open `http://localhost:3000` in your browser, authenticate with `Okta`, and receive a JWT token to authenticate with the still non-existent API for the "FeedMeWell" app.

### Define Database Model Relationships

Every good app must have a clear database model. According to the requirements for the `FeedMeWell` app I gave at the beginning of this post, these are the relations between the entities of this project:  

__User has many Restaurants <-> Restaurant has one User owner__  
__User has many Ratings <-> Rating has one User author__  
__Restaurant has many Ratings <-> Rating has one Restaurant__  
__Restaurant has many FoodDishes <-> FoodDish has one Restaurant__  

## Create models for `MySQL` database based on the entities' relations

You need a model for the User table. It will contain only a minimum amount of data because all the user info is stored by Okta.

Create a `src/models/user.ts` file:

```typescript
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Restaurant } from './restaurant';
import { Rating } from './rating';

@Entity()
export class User {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ unique: true })
  oktaUserId: string;

  @OneToMany(() => Restaurant, restaurant => restaurant.creator)
  restaurants: Promise<Array<Restaurant>>;

  @OneToMany(() => Rating, rating => rating.creator)
  ratings: Promise<Array<Rating>>;
}
```

Notice the references for the still-missing `./restaurant` and `./rating` models? You should create those, too.

This is the content of your new `Restaurant` model called `src/models/restaurant.ts`:

```typescript
import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm';
import { FoodDish } from './food-dish';
import { User } from './user';
import { Rating } from './rating';

@Entity()
export class Restaurant {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @OneToMany(() => FoodDish, foodDish => foodDish.restaurant)
  foodDishes: Promise<Array<FoodDish>>;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, user => user.restaurants)
  creator: Promise<User>;

  @OneToMany(() => Rating, rating => rating.restaurant)
  ratings: Promise<Array<Restaurant>>;

  @Column({ nullable: true })
  averageRating: number;
}
```

And this is what the model for `Rating` table should look like in the `src/models/rating.ts` file:

```typescript
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { Restaurant } from './restaurant';
import { User } from './user';

@Entity()
@Unique(['restaurantId', 'creatorId'])
export class Rating {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column({ type: 'integer' })
  rating: number;

  @Column()
  text: string;

  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.ratings)
  restaurant: Promise<Restaurant>;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, user => user.ratings)
  creator: Promise<User>;
}
```

The last model persists the information about all those delicacies served in the restaurants.

Create the `src/models/food-dish.ts` file:

```typescript
import {Entity, Column, ManyToOne, PrimaryColumn, Unique} from 'typeorm';
import { Restaurant } from './restaurant';

@Entity()
@Unique(['restaurantId', 'name'])
export class FoodDish {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'integer' })
  priceInCents: number;

  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.foodDishes)
  restaurant: Promise<Restaurant>;
}
```

That's it as far as the `MySQL` is concerned!

Now you just need to implement the missing `assertUser` function. Do this by creating a `src/services/user.ts` file:

```typescript
import { getManager } from 'typeorm';
import { User } from '../models/user';

export async function assertUser(oktaUserId: string) {
  const manager = getManager();
  const existingUser = await manager.findOne(User, { where: { oktaUserId } });
  if (existingUser) {
    return existingUser;
  }

  const user = new User();
  user.oktaUserId = oktaUserId;
  return await manager.save(user);
}
```

This function is used to synchronize user data between Okta and the `MySQL` database. Once the file is created, make sure to uncomment those two lines including the `assertUser` function in the `src/services/user.ts` file:

```typescript
...
import { assertUser } from './user';
...
...
req.user = await assertUser(sub);
...
...
```

This change attaches the  authenticated user's information to the request object.

After creating the models and defining the relations between them, `TypeORM` will make sure all those `MySQL` tables are created on the next run.

Finally, terminate the running server and restart it using the `npm start` command.

## Connect Node App to MySQL Database

After restarting the server, check the database by running `mysql` commands in the docker container:

```bash
docker-compose exec okta-feed-me-well-db mysql -u user -p okta-feed-me-well-db -p -e "select * from food_dish"
docker-compose exec okta-feed-me-well-db mysql -u user -p okta-feed-me-well-db -p -e "select * from rating"
docker-compose exec okta-feed-me-well-db mysql -u user -p okta-feed-me-well-db -p -e "select * from restaurant"
docker-compose exec okta-feed-me-well-db mysql -u user -p okta-feed-me-well-db -p -e "select * from user"
```

Don't forget to type in "password" when the program asks you for the password.

## Add CRUD Functionality to Your Node + MySQL App

(C)reating, (R)eading, (U)pdating and (D)eleting are the most basic functions of every web app. Let's add all that functionality to the restaurant resource.

Create a file called `src/controllers/restaurants.ts`:

```typescript
import express from 'express';
import { getManager } from 'typeorm';

import { Restaurant } from '../models/restaurant';
import { requireUser } from '../services/okta';
import { IExpressWithJson, JsonErrorResponse } from 'express-with-json/dist';
import { User } from '../models/user';

function isRestaurantCreatedBy(restaurant: Restaurant, user: User) {
  return restaurant.creatorId === user.id;
}

export async function createRestaurant(req: express.Request) {
  const { address, description, name, } = req.body;

  const restaurant = new Restaurant();
  restaurant.creatorId = req.user.id;
  restaurant.address = address;
  restaurant.description = description;
  restaurant.name = name;

  const manager = getManager();
  return await manager.save(restaurant);
}

export async function removeRestaurant(req: express.Request) {
  const { id } = req.params;
  const manager = getManager();
  const restaurant = await manager.findOneOrFail(Restaurant, id);

  if (!isRestaurantCreatedBy(restaurant, req.user)) {
    throw new JsonErrorResponse({ error: 'Forbidden' }, { statusCode: 403 });
  }
  await manager.remove(restaurant);
  return { ok: true };
}

export async function getAllRestaurants() {
  const manager = getManager();

  return await manager.find(Restaurant);
}

export async function getRestaurant(req: express.Request) {
  const { id } = req.params;
  const manager = getManager();

  return await manager.findOneOrFail(Restaurant, id);
}

export async function updateRestaurant(req: express.Request) {
  const { id } = req.params;
  const { address, description, name, } = req.body;
  const manager = getManager();

  const restaurant = await manager.findOneOrFail(Restaurant, id);
  if (!isRestaurantCreatedBy(restaurant, req.user)) {
    throw new JsonErrorResponse({ error: 'Forbidden' }, { statusCode: 403 });
  }

  restaurant.address = address;
  restaurant.description = description;
  restaurant.name = name;

  return await manager.save(restaurant);
}

export default (app: IExpressWithJson) => {
  app.postJson('/restaurants', requireUser, createRestaurant);
  app.deleteJson('/restaurants/:id', requireUser, removeRestaurant);
  app.getJson('/restaurants', getAllRestaurants);
  app.getJson('/restaurants/:id', getRestaurant);
  app.patchJson('/restaurants/:id', requireUser, updateRestaurant);
}
```

After adding these functions, you should be able to create a restaurant.

Launch the application, browse to `http://localhost:3000` and login. After logging in, the security token returned from Okta will be displayed in the browser window. Copy this token.

To create a restaurant, execute this cURL request (replace `TOKEN` with the actual token):

```bash
curl -X POST http://localhost:3000/restaurants \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "Test Address 125",
  "description": "The best restaurant to test your API",
  "name": "Testing Food"
}'
```

And to view all the restaurants in the database, execute this cURL request:

```bash
curl -X GET http://localhost:3000/restaurants
```

To delete the created restaurant:

```bash
curl -X DELETE http://localhost:3000/restaurants/1 -H 'Authorization: Bearer TOKEN'
```

Now re-run the POST action to recreate the restaurant. You'll need it in the next section.

There are an additional two endpoints I didn't go throughs, one for fetching a single restaurant and one for changing an existing restaurant. Try calling them yourself using `cURL` or `Postman`!

### Add Functionality to Create and Fetch Dishes

Every (Ok, most) restaurant has multiple dishes. Create a new controller `src/controllers/food-dishes.ts` so you can enter the dishes into the restaurant

```typescript
import express from 'express';
import { getManager } from 'typeorm';
import { IExpressWithJson } from 'express-with-json';
import { FoodDish } from '../models/food-dish';
import { requireUser } from '../services/okta';
import { Restaurant } from '../models/restaurant';

export async function createFoodDish(req: express.Request) {
  const { restaurantId } = req.params;
  const manager = getManager();
  await manager.findOneOrFail(Restaurant, restaurantId);

  const { description, name, priceInCents } = req.body;

  const foodDish = new FoodDish();
  foodDish.description = description;
  foodDish.name = name;
  foodDish.priceInCents = parseInt(priceInCents);
  foodDish.restaurantId = parseInt(restaurantId);

  return manager.save(foodDish);
}

export async function getRestaurantFoodDishes(req: express.Request) {
  const { restaurantId } = req.params;

  return await getManager().find(FoodDish, { where: { restaurantId } });
}

export default (app: IExpressWithJson) => {
  app.postJson('/restaurants/:restaurantId/food-dishes', requireUser, createFoodDish);
  app.getJson('/restaurants/:restaurantId/food-dishes', getRestaurantFoodDishes);
}
```

Create a food dish for your new favorite restaurant:

```bash
curl -X POST \
  http://localhost:3000/restaurants/2/food-dishes
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "description": "Exclusive dish made entirely of cURL",
  "name": "testing food dish",
  "priceInCents": 5000
}'
```

Check out all the dishes of your favorite restaurant:

```bash
curl -X GET http://localhost:3000/restaurants/2/food-dishes
```

### Add Rating Functionality

To allow users to rate restaurants, you must implement a controller for rating functionality `src/controllers/ratings.ts`:

```typescript
import { getManager } from 'typeorm';
import express from 'express';
import { IExpressWithJson, JsonErrorResponse } from 'express-with-json';
import { Rating } from '../models/rating';
import { requireUser } from '../services/okta';

export async function createRating(req: express.Request) {
  const { restaurantId } = req.params;
  const { rating: ratingString, text } = req.body;

  const ratingNumber = parseInt(ratingString);
  if (ratingNumber < 0 || ratingNumber > 5) {
    throw new JsonErrorResponse({ error: 'Rating must be between 1 and 5' }, { statusCode: 400 });
  }

  const rating = new Rating();
  rating.creatorId = req.user.id;
  rating.rating = ratingNumber;
  rating.restaurantId = parseInt(restaurantId);
  rating.text = text;

  return await getManager().save(rating);
}

export async function getRestaurantRatings(req: express.Request) {
  const { restaurantId } = req.params;

  return await getManager().find(Rating, { where: { restaurantId } });
}

export default function(app: IExpressWithJson) {
  app.postJson('/restaurants/:restaurantId/ratings', requireUser, createRating);
  app.getJson('/restaurants/:restaurantId/ratings', getRestaurantRatings);
}
```

Again, use `cURL` to create a rating for an existing restaurant:

```bash
curl -X POST \
  http://localhost:3000/restaurants/2/ratings \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "rating": 5,
  "text": "This is the best restaurant I'\''ve ever POSTed"
}'
```

You can now view all the ratings for any given restaurant:

```bash
curl -X GET http://localhost:3000/restaurants/2/ratings
```

If you try fetching the restaurants, you'll notice that they are all missing the `averageRating` field.
That's because it hasn't been set yet. It must be set and then updated with every rating change.

Create a `TypeORM` subscriber `src/subscribers/restaurant-rating-subscriber.ts` for this purpose:

```typescript
import { Rating } from '../models/rating';
import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent
} from 'typeorm';
import { Restaurant } from '../models/restaurant';

async function getAverageRating(manager: EntityManager, restaurantId: number): Promise<number> {
  const response = await manager.query(
    `select AVG(rating) as averageRating from rating where rating.restaurantId = ${restaurantId}`
  );

  return response[0].averageRating;
}

async function recalculateAverageRating(manager: EntityManager, restaurantId: number) {
  const restaurant = await manager.findOneOrFail(Restaurant, restaurantId);
  restaurant.averageRating = await getAverageRating(manager, restaurantId);
  await manager.save(restaurant);
}

@EventSubscriber()
export class RestaurantRatingSubscriber implements EntitySubscriberInterface<Rating> {
  listenTo() {
    return Rating;
  }

  async afterInsert(event: InsertEvent<Rating>) {
    await recalculateAverageRating(event.manager, event.entity.restaurantId);
  }

  async afterUpdate(event: UpdateEvent<Rating>) {
    await recalculateAverageRating(event.manager, event.entity.restaurantId);
  }

  async afterRemove(event: RemoveEvent<Rating>) {
    await recalculateAverageRating(event.manager, event.entity.restaurantId);
  }
}
```

Now try deleting all the ratings:

```bash
docker-compose exec okta-feed-me-well-db mysql -u user -p okta-feed-me-well-db -p -e "delete from rating"
```

And then recreate the ratings from before:

```bash
curl -X POST \
  http://localhost:3000/restaurants/2/ratings \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "rating": 5,
  "text": "This is the best restaurant I'\''ve ever POSTed"
}'
```

Restaurant with ID 2 now contains a valid `averageRating`.

## Learn More About Node.js, MySQL, Express and User Auth!

If you've stuck with me to this point, you have successfully setup a virtual MySQL environment, connected it to a bootstrapped Express app, built out restaurant rating functionality, and made it all secure with user auth! Nice job.

Now that you're on a roll learning new stuff, keep it going with these other posts related to the topics and technologies we used in this article:

- [MySQL vs PostgreSQL -- Choose the Right Database for Your Project](https://developer.okta.com/blog/2019/07/19/mysql-vs-postgres)
- [Build a REST API with Node and Postgres](https://developer.okta.com/blog/2019/03/27/build-rest-api-with-node-and-postgres)
- [Modern Token Authentication in Node with Express](https://developer.okta.com/blog/2019/02/14/modern-token-authentication-in-node-with-express)
- [Build a Simple REST API with Node and OAuth 2.0](https://developer.okta.com/blog/2018/08/21/build-secure-rest-api-with-node)

Questions? Requests for a future post? Drop them in the comments! And don't forget to follow [@oktadev on Twitter](https://twitter.com/oktadev) and [subscribe on Youtube](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q). =)
