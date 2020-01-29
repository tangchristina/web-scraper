// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

//Set up default port
  var PORT = process.env.PORT ||3000;

// Initialize Express
var app = express();
var db = require("./models");

// Controllers
const router = require("./controller/apiRoutes.js");
app.use(router);

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ 
  defaultLayout: "main",
 }));
app.set("view engine", "handlebars");

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nyt_scraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, (error) => {
	if (!error) {console.log("Connected!");}
	else (console.log('mongoose error: ' + error));
});

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});



