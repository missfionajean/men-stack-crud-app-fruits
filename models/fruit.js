// importing mongoose package for local use
const mongoose = require("mongoose");

// defining schema (datum format for fruits on MongoDB)
const fruitSchema = new mongoose.Schema({
	name: String,
	isReadyToEat: Boolean,
});

// combines elements into usable model
const Fruit = mongoose.model("Fruit", fruitSchema);

// exports model for use in other project files
module.exports = Fruit;
