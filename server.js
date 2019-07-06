var express = require("express");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware


// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Routes
require("./config/routes")(app);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = "mongodb://localhost/mongoHeadlines";

// Connect DB to Mongoose
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function(error) {
	if (error) {
		console.log(error);
	} else {
		console.log("Mongoose Connection is Successful!")
	}
});
mongoose.set('useCreateIndex', true);


// Start the server
app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");
});