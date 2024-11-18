/* ----------------------------------------------------------- */
/* ------------------- Importing Packages -------------------- */
/* ----------------------------------------------------------- */

// importing .env package for local use
const dotenv = require("dotenv");
// Loads the environment variables from .env file
dotenv.config();

// importing express package for local use
const express = require("express");
// making express more usable by storing in variable
const app = express();

// importing mongoose (mongo butler) package for local use
const mongoose = require("mongoose");

// adding in dependencies for DELETE functionality
const methodOverride = require("method-override");
const morgan = require("morgan");

/* ----------------------------------------------------------- */
/* ------------------- Database Connection ------------------- */
/* ----------------------------------------------------------- */

// connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);

// log connection status to terminal on start
mongoose.connection.on("connected", () => {
	console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// import fruit DB model for local use (CRUD functionality)
const Fruit = require("./models/fruit.js");

/* LECTURE NOTES: This middleware parses incoming request bodies, extracting form data and converting it into a JavaScript object. It then attaches this object to the req.body property of the request, making the form data easily accessible within our route handlers. To enable this functionality, add the following line to server.js, right after importing the Fruit model. */
app.use(express.urlencoded({ extended: false }));

// telling express to use more installed middleware
app.use(methodOverride("_method"));
app.use(morgan("dev"));

/* ----------------------------------------------------------- */
/* -------------------- Server Connection -------------------- */
/* ----------------------------------------------------------- */

// making an easily modifiable server port
const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

/* ----------------------------------------------------------- */
/* ------------------------- Routes -------------------------- */
/* ----------------------------------------------------------- */

// GET request, path "/" (notice the addition of async in function)
app.get("/", async (req, res) => {
	res.render("index.ejs");
});

// GET request, path "/fruits" (for displaying DB contents)
app.get("/fruits", async (req, res) => {
	// finds all data in database defined by "Fruit" variable
	const allFruits = await Fruit.find();
	// renders fruit-index.ejs with data in unnamed local object; first parameter will be an iterable array called "fruits"
	res.render("fruits/fruit-index.ejs", { fruits: allFruits });
});

// GET request, path "/fruits/new"
app.get("/fruits/new", (req, res) => {
	// renders new.ejs EJS/HTML template
	res.render("fruits/new.ejs");
});

// must be BELOW "fruits/new" route or it will take "new" as param
app.get("/fruits/:fruitId", async (req, res) => {
	const foundFruit = await Fruit.findById(req.params.fruitId);
	res.render("fruits/show.ejs", { fruit: foundFruit });
});

// POST request, path "/fruits" (async since we're dealing with DB)
app.post("/fruits", async (req, res) => {
	// codeblock to be run (adjusts schema based on HTML form)
	if (req.body.isReadyToEat === "on") {
		req.body.isReadyToEat = true;
	} else {
		req.body.isReadyToEat = false;
	}

	// logs req.body for testing purposes; should be an object that matches the schema defined for fruit model (imported under variable name "Fruit"), info pulled from "body" HTML
	console.log(req.body);

	// creates a new datum, waiting until complete to continue
	await Fruit.create(req.body);

	// redirects user back to empty "new" page to enter more
	res.redirect("/fruits");
});

/* INPORTANT NOTE: HTTP requests are attached to a path, but are unique from each other, that's why you have a GET and POST request pointing to the same URL path. You need both to be able to update AND view the page. POST to add data. GET to render the EJS file. */

app.delete("/fruits/:fruitId", async (req, res) => {
	// deletes database entry (will no longer be rendered to EJS)
	await Fruit.findByIdAndDelete(req.params.fruitId);
	// sends back to fruit list (now updated)
	res.redirect("/fruits");
});

// GET request; path "/fruits/:fruitId/edit" (for rendering)
app.get("/fruits/:fruitId/edit", async (req, res) => {
	const foundFruit = await Fruit.findById(req.params.fruitId);
	res.render("fruits/edit.ejs", { fruit: foundFruit });
});

// PUT request; path "/fruits/:fruitId"
app.put("/fruits/:fruitId", async (req, res) => {
	// Handle the 'isReadyToEat' checkbox data
	if (req.body.isReadyToEat === "on") {
		req.body.isReadyToEat = true;
	} else {
		req.body.isReadyToEat = false;
	}

	// Update the fruit in the database (grabs data from form)
	await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

	// Redirect to the fruit's show page to see the updates
	res.redirect(`/fruits/${req.params.fruitId}`);
});
