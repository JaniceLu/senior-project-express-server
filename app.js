const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const assignments = require("./Assignments/assignments.js");
const classes = require("./Classes/classes.js");
const user = require("./Users/users.js");
const roster = require("./Roster/roster.js");

const port = process.env.PORT || 3000;
const dburl = process.env.DATABASE_URL || process.env.DATABASE_URI;
const connection = mysql.createConnection(dburl);

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(cors());

connection.connect(function (err) {
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
app.post("/signup", (req, res) => user.addUser(req, res, connection));

/**
 * Use Case 1.1.1 and 2.1.1
 */
app.post("/signin", (req, res) => user.getUserInfo(req, res, connection));

/**
 * Use Case 1.1.2
 */
app.post("/getstudentassignments", (req, res) =>
  assignments.getStudentAssignments(req, res, connection)
);

/**
 * Use Case 1.2.2
 * Change History:
 * 3/10 - changed so that all parameters are needed for update
 */
app.post("/updateprofile", (req, res) =>
  user.updateUserInfo(req, res, connection)
);

/**
 * Use case 1.3.1, 2.6.2
 */
app.post("/leaveclass", (req, res) => roster.deleteUser(req, res, connection));

/**
 * Use case 1.4.1
 */
app.post("/adduser", (req, res) => roster.addUser(req, res, connection));

/*
 * Use Case 1.5.2
 */
app.post("/getstudentquestions", (req, res) =>
  assignments.getStudentAssignmentQuestions(req, res, connection)
);

/*
 * Use Case 1.5.3
 */
app.post("/updatestudentprogress", (req, res) =>
  assignments.updateStudentProgress(req, res, connection)
);

/**
 * Use Case 2.2.1
 */
app.post("/deleteclass", (req, res) =>
  classes.deleteClass(req, res, connection)
);

/**
 * Use case 2.3.1
 */
app.post("/createclass", (req, res) =>
  classes.createClass(req, res, connection)
);

/**
 * Use case 2.1.2, 2.3.2
 */
app.post("/getclasses", (req, res) => classes.getClasses(req, res, connection));

/**
 * Use Case 2.4.1, 2.10.1
 */
app.post("/viewclass", (req, res) =>
  classes.getClassAssgnInfo(req, res, connection)
);

/**
 * Use Case 2.5.1
 */
app.post("/viewroster", (req, res) => roster.getRoster(req, res, connection));

/**
 * Use Case 2.6.1
 */
app.post("/viewrosterrequests", (req, res) =>
  roster.getRosterRequests(req, res, connection)
);

/**
 * Use Case 2.6.3
 */
app.post("/acceptrequest", (req, res) =>
  roster.acceptRequest(req, res, connection)
);

/**
 * Use Case 2.7.2
 */
app.post("/getteacherstudentprogress", (req, res) =>
  assignments.getTeacherStudentAssgnProg(req, res, connection)
);

/**
 * Use Case 2.7.4
 */
app.post("/getincompleteassgn", (req, res) =>
  assignments.getIncompleteAssgn(req, res, connection)
);

/*
 * Use Case 2.8.1
 */
app.post("/getassignment", (req, res) =>
  assignments.getAssignment(req, res, connection)
);

/*
 * Use Case 2.8.2
 */
app.post("/replaceassignment", (req, res) =>
  assignments.replaceAssignment(req, res, connection)
);

/**
 * Use Case 2.9.1
 */
app.post("/createassignment", (req, res) =>
  assignments.createAssignment(req, res, connection)
);

/**
 * Use Case 2.10.2
 */
app.post("/updateclass", (req, res) =>
  classes.updateClass(req, res, connection)
);

/*
 * Use Case 2.11.1
 */
app.post("/deleteassignment", (req, res) =>
  assignments.deleteAssignment(req, res, connection)
);

app.listen(port, () => console.log(`Listening on port ${port}!`));
