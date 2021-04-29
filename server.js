// import and init express
const express = require("express");
const app = express();
// PORT
const PORT = process.env.PORT || 5000;
// import dotenv configuration
require("dotenv").config();
// import mongoose
const mongoose = require("mongoose");
// import to do model
const ToDo = require("./models/ToDo");

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

// import Routes file
// const toDoRouter = require("./routes/toDoRouter");

// Settings :
// static setup
app.use(express.static(__dirname + "/public"));

// view engine setup
app.set("view engine", "hbs");

// built in middleware
// app.use(express.json());

// third party middleware
app.use(
  express.urlencoded({
    extended: false,
  })
);
// routing
// app.use("/", toDoRouter);

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
app.get("/todolist/update/:id", (req, res) => {
  const taskId = req.params.id;
  ToDo.findByIdAndUpdate(taskId, { title: "Make coffee" }, (err, doc) => {
    console.log("Updated value :", doc);
    res.redirect("/todolist");
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

// listen
app.listen(PORT, () => {
  console.log(`Server is running in PORT : ${PORT} `);
});
