# Blenda

Let's make photo sharing fun and simple again!

## What problems are we solving

Photo sharing sites of today are bad. They steal photos from us, sell out to Yahoo and deprecate our old accounts and data. They unecessary complicate things and even charge for their services.

* We build on top Dropbox and use it as our main storage.

Data should be yours, exportable and easy to mess with.

* We keep things extremely simple

We don't have a proper authentication system. Sign in with Dropbox and enjoy - all it takes is two clicks.

## Goals

1. simplicity is key, our religion is minimalism - keep it simple
2. beautiful UI, should have parity with the competition

## Competition

500px and Flickr.

500px sucks because they bill their service and are annoying with that.
Flickr sucks because its owned by Yahoo.

## MVP

1. Sign in with Dropbox
2. Show photos from Dropbox
3. Photo upload (to Dropbox)
4. System for likes and followers
5. Display trending photos on the main page
6. Billing system

## Development

Technology:

* [npm](https://www.npmjs.org/)
* [gulp](https://github.com/gulpjs/gulp)
* [browserify](https://github.com/substack/node-browserify)
* [Express](https://github.com/strongloop/express)
* [riot.js](https://github.com/muut/riotjs)
* [MongoDB](http://www.mongodb.org/)
* [redis](http://redis.io/)

First make sure you have MongoDB installed and that you have started the Mongo server.

Image resizing is done in background jobs that are using Redis. Make sure you have Redis server
started.

```
npm install # will install deps
npm start # will start servers
npm run watch # will start reloader
npm test # will run tests
```

We use [sharp](https://github.com/lovell/sharp#readme) for image resizing and it depends on
[libvips](https://github.com/jcupitt/libvips#readme), make sure you have `libvips` installed on your machine.
