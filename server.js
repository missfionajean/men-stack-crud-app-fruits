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

// GET request, path "/fruits/new"
app.get("/fruits/new", (req, res) => {
	res.render("fruits/new.ejs");
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
	res.redirect("/fruits/new");
});
