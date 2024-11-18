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
/* ------------------- Server Connection --------------------- */
/* ----------------------------------------------------------- */

// connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);

// log connection status to terminal on start
mongoose.connection.on("connected", () => {
	console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// import fruit DB model for local use (CRUD functionality)
const Fruit = require("./models/fruit.js");

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
