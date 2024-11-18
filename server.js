/* ----------------------------------------------------------- */
/* ------------------- Importing Packages -------------------- */
/* ----------------------------------------------------------- */

// importing express package for local use
const express = require("express");

// making express more usable by storing in variable
const app = express();

// making an easily editable server port
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
