const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect("mongodb://localhost:27017/booksStore")
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log("Failed to connect to the database:", err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
