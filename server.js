// import and init express
const express = require("express");
const app = express();
// import dotenv configuration
require("dotenv").config();
// import mongoose
const mongoose = require("mongoose");
// import to do model
const ToDo = require("./models/ToDo");
// import override method
const methodOverride = require("method-override");
// PORT
const PORT = process.env.PORT || 5000;
// MongoDB connection with mongoose
const DB_NAME = process.env.DB_NAME;

const DB_LINK = process.env.MONGO_LINK + DB_NAME;
mongoose
  .connect(DB_LINK)
  .then(() => {
    console.log("MongoDB successfully connected");
  })
  .catch(() => {
    console.log("MongoDB connection failed");
  });

// Settings :
// static setup
app.use(express.static(__dirname + "/public"));

// override method
app.use(methodOverride("_method"));

// view engine setup
app.set("view engine", "hbs");

// third party middleware
app.use(
  express.urlencoded({
    extended: false,
  })
);
// routing
// CRUD method

// C (Create)
app.post("/todolist", (req, res) => {
  req.body.createdAt = Date.now();
  // save in DB
  const newToDo = new ToDo(req.body);
  // save
  newToDo.save(() => {
    res.redirect("/todolist");
    // res.render("tasklist", { message: "Task successfully added" });
  });
});

// R (Read)
app.get("/todolist", (req, res) => {
  ToDo.find((err, items) => {
    res.render("tasklist", { items });
  });
});

// Update (U)
app.post("/todolist/:id", (req, res) => {
  const taskId = req.params.id;
  ToDo.findByIdAndUpdate(taskId, req.body, { new: true }, (err, doc) => {
    console.log("Updated value :", doc);
    res.redirect("/todolist");
  });
});
// new update form
app.get("/todolist/update/:id", (req, res) => {
  const { id } = req.params;
  ToDo.findById(id, (err, doc) => {
    res.render("update", { todo: doc });
  });
});

// Delete (D)
app.get("/todolist/delete/:id", (req, res) => {
  const taskId = req.params.id;
  ToDo.findByIdAndDelete(taskId, (err, doc) => {
    console.log("This doc is deleted:", doc);
    res.redirect("/todolist");
  });
});
// delete message page
app.get("/todolist/:id", (req, res) => {
  const { id } = req.params;
  ToDo.findById(id, (ree, doc) => {
    res.render("delete", { todo: doc });
  });
});

// listen
app.listen(PORT, () => {
  console.log(`Server is running in PORT : ${PORT} `);
});
