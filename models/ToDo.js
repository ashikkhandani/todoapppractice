// import mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema object
const toDoSchema = new Schema({
  title: String,
  time: String,
  date: String,
  createdAt: Date,
});
//Eidted
// declaration model
const ToDo = mongoose.model("ToDo", toDoSchema);

// export
module.exports = ToDo;
