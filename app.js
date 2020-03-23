const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const classes = require('./Classes/classes.js')
const user = require('./Users/users.js');

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
app.post("/signup", user.addUser());

/**
 * Use Case 1.1.1 and 2.1.1
 */
app.post("/signin", user.getUserInfo());

/**
 * Use Case 1.2.2
 * Change History:
 * 3/10 - changed so that all parameters are needed for update
 */
app.post("/updateprofile", user.updateUserInfo());

/**
 * Use Case 2.2.1
 */
app.post("/deleteclass", classes.deleteClass());

/**
 * Use case 2.3.1
 */
app.post("/createclass", classes.createClass());

/**
 * Use Case 2.4.1
 */
app.post("/viewclass", classes.getClass());

/**
 * Use Case 2.10.2
 */
app.post("/updateclass", classes.updateClass());

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
