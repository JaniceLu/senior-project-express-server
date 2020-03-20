const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");

const port = process.env.PORT || 3000;
const connection = mysql.createConnection({
  host: "mysql-quickmaths-9472.nodechef.com:2383",
  user: "ncuser_3219",
  password: "39t1xTgOSpST0SJUIyTiBwBGFutlyo",
  database: "quickmaths",
  multipleStatements: true
});

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(cors());

connection.connect(function(err) {
  console.log(process.env.DATABASE_URL);
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("Connected to the DB!");
});

/**
 * Use Case 0.1.1
 */
const ADD_NEW_USER_QUERY = "INSERT INTO users SET ?";
app.post("/signup", function(req, res) {
  console.log("Sign Up body given: ");
  console.log(req.body);
  var new_user = {
    firebase_id: req.body.firebase_id,
    school_id: req.body.school_id,
    name: req.body.name,
    is_teacher: req.body.is_teacher,
    email: req.body.email
  };
  connection.query(ADD_NEW_USER_QUERY, new_user, function(err, results) {
    if (err) {
      console.log("didn't work");
      console.log(err);
      res.send(err);
    } else {
      console.log("it worked");
      res.send(results);
    }
  });
});

/**
 * Use Case 1.1.1 and 2.1.1
 */
const GET_USER_INFO_QUERY =
  "SELECT firebase_id, is_teacher from users WHERE firebase_id = ?";
app.post("/signin", function(req, res) {
  console.log("Sign In body given: ");
  console.log(req.body);
  connection.query(GET_USER_INFO_QUERY, req.body.firebase_id, function(
    err,
    results
  ) {
    if (err) {
      console.log("didn't work");
      console.log(err);
      res.send(err);
    } else {
      if (results && results.length) {
        console.log("user has been found");
        console.log(results);
        res.send(results);
      } else {
        console.log("no user with firebase id: " + req.body.firebase_id);
        console.log(results);
        res.send(results);
      }
    }
  });
});

/**
 * Use Case 1.2.2
 * Change History:
 * 3/10 - changed so that all parameters are needed for update
 */
const UPDATE_USER_INFO_QUERY = "UPDATE users SET ? WHERE firebase_id = ?";
app.post("/updateprofile", function(req, res) {
  console.log("Update Profile body given: ");
  console.log(req.body);
  var updatedInfo = {
    school_id: req.body.school_id,
    name: req.body.name,
    email: req.body.email
  };
  connection.query(
    UPDATE_USER_INFO_QUERY,
    [updatedInfo, req.body.firebase_id],
    function(err, results) {
      if (err) {
        console.log("didn't work");
        console.log(err);
        res.send(err);
      } else {
        if (results) {
          console.log("user info has been changed");
          console.log(results);
          res.send(results);
        } else {
          console.log("user info has not been changed");
          console.log(results);
          res.send(results);
        }
      }
    }
  );
});

/**
 * Use Case 2.2.1
 */
const DELETE_CLASS_QUERY = "DELETE FROM classes where id = ?";
app.post("/deleteclass", function(req, res) {
  console.log("Delete Class body given: ");
  console.log(req.body);
  connection.query(DELETE_CLASS_QUERY, req.body.id, function(err, results) {
    if (err) {
      console.log("didn't work");
      console.log(err);
      res.send(err);
    } else {
      console.log(results);
      res.send(results);
    }
  });
});

/**
 * Use case 2.3.1
 */
const ADD_NEW_CLASS_QUERY = "INSERT INTO classes SET ?";
app.post("/createclass", function(req, res) {
  console.log("Create Class body given: ");
  console.log(req.body);
  var newClass = {
    firebase_id: req.body.firebase_id,
    class_title: req.body.class_title,
    class_year: req.body.class_year
  };
  connection.query(ADD_NEW_CLASS_QUERY, newClass, function(err, results) {
    if (err) {
      console.log("didn't work");
      console.log(err);
      res.send(err);
    } else {
      if (results) {
        console.log("class has been added");
        console.log(results);
        res.send(results);
      } else {
        console.log("could not add class");
        console.log(results);
        res.send(results);
      }
    }
  });
});

/**
 * Use Case 2.4.1
 */
const GET_CLASS_INFO_QUERY =
  "SELECT id, name, due_date, pub_date from assignments WHERE class_id = ?";
app.post("/viewclass", function(req, res) {
  console.log("View Class body given: ");
  console.log(req.body);
  connection.query(GET_CLASS_INFO_QUERY, req.body.class_id, function(
    err,
    results
  ) {
    if (err) {
      console.log("didn't work");
      console.log(err);
      res.send(err);
    } else {
      if (results) {
        if (results.length) {
          console.log("class has been found and has assignments");
        } else {
          console.log("class has been found but no assignments");
        }
        console.log(results);
        res.send(results);
      } else {
        console.log("could not find class");
        console.log(results);
        res.send(results);
      }
    }
  });
});

/**
 * Use Case 2.10.2
 */
const UPDATE_CLASS_INFO_QUERY = "UPDATE classes SET ? WHERE id = ?";
app.post("/updateclass", function(req, res) {
  console.log("Update Class body given: ");
  console.log(req.body);
  var updatedData = {
    firebase_id: req.body.firebase_id,
    class_title: req.body.class_title,
    class_year: req.body.class_year
  };
  connection.query(
    UPDATE_CLASS_INFO_QUERY,
    [updatedData, req.body.id],
    function(err, results) {
      if (err) {
        console.log("didn't work");
        console.log(err);
        res.send(err);
      } else {
        if (results) {
          console.log("class info has been changed");
          console.log(results);
          res.send(results);
        } else {
          console.log("class info has not been changed");
          console.log(results);
          res.send(results);
        }
      }
    }
  );
});

/*
 * Use Case 2.9.1
 */
const CREATE_ASSIGNMENT_QUERY = `START TRANSACTION;
INSERT INTO assignments SET ?;
INSERT INTO questions (assignment_id,question,answer) VALUES ?;
COMMIT;`;
app.post("/createassignment", (req, res) => {
  /*
   * Expected Body format:
   * body: {
   *    class_id: int,
   *    name: string,
   *    due_date: 'YYYY-MM-DD',
   *    number_of_questions: int,
   *    questions: [{question: '5 + 5', answer: 10},{question: '10 + 11', answer: 21}]
   * }
   */
  console.log("Create Assignment body given: ");
  console.log(req.body);

  const currentDate = moment().format("YYYY-MM-DD");
  const assignmentData = {
    class_id: req.body.class_id,
    name: req.body.name,
    due_date: req.body.due_date,
    pub_date: currentDate,
    number_of_questions: req.body.number_of_questions
  };
  console.log("Assignment Data before MySQL query: ");
  console.log(assignmentData);

  const answerData = req.body.questions.map(Object.values);
  console.log("Answer Data before MySQL query: ");
  console.log(answerData);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
