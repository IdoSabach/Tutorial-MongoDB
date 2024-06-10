const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// Init app & middleware
const app = express();

// DB connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3001, () => {
      console.log("App listening on port 3001");
    });
    db = getDb();
  } else {
    console.log("Failed to connect to the database. Server not started.");
  }
});

// Routes
app.get("/books", (req, res) => {
  db.collection("books")
    .find()
    .sort({ author: 1 })
    .toArray()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((err) => {
      console.error("Error fetching books:", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching books." });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "error" });
      });
  }else{
    res.status(500).json({error:"error not valid"})
  }
});
