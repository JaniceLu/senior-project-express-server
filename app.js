const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const assignments = require("./Assignments/assignments.js");
const classes = require("./Classes/classes.js");
const user = require("./Users/users.js");

const port = process.env.PORT || 3000;
const dburl = process.env.DATABASE_URL || process.env.DATABASE_URI;
const connection = mysql.createConnection(dburl);

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(cors());

connection.connect(function(err) {
  if (err) {
    console.log("Error connecting to DB");
    console.log(err);
    throw err;
  }
  console.log("Connected to the DB!");
});

/**
 * Use Case 0.1.1
 */
app.post("/signup", user.addUser);

/**
 * Use Case 1.1.1 and 2.1.1
 */
app.post("/signin", user.getUserInfo);

/**
 * Use Case 1.2.2
 * Change History:
 * 3/10 - changed so that all parameters are needed for update
 */
app.post("/updateprofile", (req, res) => user.updateUserInfo(req, res));

/**
 * Use Case 2.2.1
 */
app.post("/deleteclass", (req, res) => classes.deleteClass(req, res));

/**
 * Use case 2.3.1
 */
app.post("/createclass", (req, res) => classes.createClass(req, res));

/**
 * Use Case 2.4.1
 */
app.post("/viewclass", (req, res) => classes.getClass(req, res));

/**
 * Use Case 2.10.2
 */
app.post("/updateclass", (req, res) => classes.updateClass(req, res));

/*
 * Use Case 2.9.1
 */
app.post("/createassignment", (req, res) =>
  assignments.createAssignment(req, res)
);

app.listen(port, () => console.log(`Listening on port ${port}!`));
