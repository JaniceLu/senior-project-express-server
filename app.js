const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");

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
      console.log("Error adding user");
      console.log(err);
      res.send({ failed: true });
    } else {
      console.log("Inserted User");
      res.send({ failed: false });
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
      console.log("Error getting user");
      console.log(err);
      res.send({ failed: true });
    } else {
      if (results && results.length) {
        console.log("User has been found");
        console.log(results);
        res.send(results);
      } else {
        console.log("No user with firebase id: " + req.body.firebase_id);
        console.log(results);
        res.send({ failed: true });
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
        console.log("Error updating profile");
        console.log(err);
        res.send({ failed: true });
      } else {
        if (results) {
          console.log("User info has been changed");
          console.log(results);
          res.send({ failed: false });
        } else {
          console.log("User info has not been changed"); //Does this mean none of the attributes were different, therefore not updated?
          console.log(results);
          res.send({ failed: false });
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
      console.log("Error deleting class");
      console.log(err);
      res.send({ failed: true });
    } else {
      console.log("Deleted class");
      console.log(results);
      res.send({ failed: false });
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
      console.log("Error adding class");
      console.log(err);
      res.send({ failed: true });
    } else {
      if (results) {
        console.log("Class has been added");
        console.log(results);
        res.send({ failed: false });
      } else {
        console.log("Could not add class"); //When does this happen?
        console.log(results);
        res.send({ failed: true });
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
      console.log("Error viewing class");
      console.log(err);
      res.send({ failed: true });
    } else {
      if (results) {
        if (results.length) {
          console.log("Class has been found and has assignments");
        } else {
          console.log("Class has been found but no assignments");
        }
        console.log(results);
        res.send(results);
      } else {
        console.log("Could not find class"); //When does this happen?
        console.log(results);
        res.send({ failed: true });
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
        console.log("Error updating class");
        console.log(err);
        res.send({ failed: true });
      } else {
        if (results) {
          console.log("Class info has been changed");
          console.log(results);
          res.send({ failed: false });
        } else {
          console.log("Class info has not been changed"); //What does this mean?
          console.log(results);
          res.send({ failed: false });
        }
      }
    }
  );
});

/*
 * Use Case 2.9.1
 */
const CREATE_ASSIGNMENT_QUERY = `INSERT INTO assignments SET ?`;
const CREATE_QUESTIONS_QUERY = `INSERT INTO questions (assignment_id,question,answer) VALUES ?`;
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
  const requestBody = req.body;
  console.log("Create Assignment body given: ");
  console.log(requestBody);
  connection.beginTransaction(function(err) {
    if (err) {
      console.log("Error creating assignment transaction");
      console.log(err);
      res.send({ failed: true });
    }

    //Work on inserting the assignments first
    const assignmentData = {
      class_id: requestBody.class_id,
      name: requestBody.name,
      due_date: requestBody.due_date,
      pub_date: moment().format("YYYY-MM-DD"),
      number_of_questions: requestBody.number_of_questions
    };

    connection.query(CREATE_ASSIGNMENT_QUERY, assignmentData, function(
      error,
      results,
      fields
    ) {
      if (error) {
        return connection.rollback(function() {
          console.log("Error inserting assignment");
          console.log(err);
          res.send({ failed: true });
        });
      }

      //MySQL inserting multiple records requires that all data is inside a 2D array
      const assignmentId = results.insertId;
      const questionData = requestBody.questions.map(obj => [
        assignmentId,
        ...Object.values(obj)
      ]);

      //If assignment insertion was successful, work on inserting the questions next
      connection.query(CREATE_QUESTIONS_QUERY, [questionData], function(
        error,
        results,
        fields
      ) {
        if (error) {
          return connection.rollback(function() {
            console.log("Error inserting questions");
            console.log(err);
            res.send({ failed: true });
          });
        }
        connection.commit(function(err) {
          if (err) {
            return connection.rollback(function() {
              console.log("Error commiting create assignment transaction");
              console.log(err);
              res.send({ failed: true });
            });
          }
          console.log("Assignment has been added!");
          res.send({ failed: false });
        });
      });
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
