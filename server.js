var express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require("morgan");
var cheerio = require("cheerio");
var axios = require("axios");
var request = require("request");



// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


// Set mongoose to leverage built in JavaScript ES6 Promises
//Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, {
//   useMongoClient: true
// });

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;


app.use(express.static("public"));

// Configure middleware
// =============================================================

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoHeadlines");

// Routes
// =============================================================
require("./routes.js")(app);

// Set Handlebars.
// =============================================================
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");




// Start Server
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
