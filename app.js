const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

// Init app & middleware
const app = express();
app.use(express.json());

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
  // current page
  const page = req.query.p || 0
  const booksPerPage = 3 

  let books = [];
  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
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
  } else {
    res.status(500).json({ error: "error not valid" });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "error not add book" });
    });
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "error not delete" });
      });
  } else {
    res.status(500).json({ error: "error not valid" });
  }
});

app.patch("/books/:id", (req, res) => {
  const updates = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "error not updates delete" });
      });
  } else {
    res.status(500).json({ error: "error not valid" });
  }
});
