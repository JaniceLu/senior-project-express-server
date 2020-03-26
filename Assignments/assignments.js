const moment = require("moment");

const CREATE_ASSIGNMENT_QUERY = `INSERT INTO assignments SET ?`;
const CREATE_QUESTIONS_QUERY = `INSERT INTO questions (assignment_id,question,answer) VALUES ?`;
const createAssignment = (req, res, connection) => {
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
      results
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
      connection.query(CREATE_QUESTIONS_QUERY, [questionData], function(error) {
        if (error) {
          return connection.rollback(function() {
            console.log("Error inserting questions");
            console.log(err);
            res.send({ failed: true });
          });
        }

        //If both operations succeed, commit the changes
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
};

const GET_ASSIGNMENT_QUERY = `SELECT name, due_date FROM assignments WHERE id = ?`;
const GET_QUESTIONS_QUERY = `SELECT id, question, answer FROM questions WHERE id = ?`;
const getAssignment = (req, res, connection) => {
  const requestBody = req.body;
  console.log("Get Assignment body given: ");
  console.log(requestBody);
  connection.beginTransaction(function(err) {
    if (err) {
      console.log("Error viewing assignment transaction");
      console.log(err);
      res.send({ failed: true });
    }

    //Get assignment data first
    connection.query(GET_ASSIGNMENT_QUERY, requestBody.id, function(
      error,
      assignmentResults
    ) {
      if (error) {
        return connection.rollback(function() {
          console.log("Error viewing assignment");
          console.log(err);
          res.send({ failed: true });
        });
      }

      //If assignment read was successful, work on reading the questions next
      connection.query(GET_QUESTIONS_QUERY, requestBody.id, function(
        error,
        questionsResults
      ) {
        if (error) {
          return connection.rollback(function() {
            console.log("Error viewing questions");
            console.log(err);
            res.send({ failed: true });
          });
        }

        //If both reads succeed, put the results together
        connection.commit(function(err) {
          if (err) {
            return connection.rollback(function() {
              console.log("Error commiting create assignment transaction");
              console.log(err);
              res.send({ failed: true });
            });
          }

          //This happens when we ask for an ID that doesn't exist
          if (assignmentResults.length < 1) {
            console.log("Assignment was not found with the given id");
            res.send({ failed: true });
          } else {
            console.log("Assignment has been retrieved!");
            const assignment = assignmentResults[0];
            const combinedResults = {
              assignment_name: assignment.name,
              due_date: assignment.due_date,
              questions: questionsResults
            };
            res.send(combinedResults);
          }
        });
      });
    });
  });
};

exports.createAssignment = createAssignment;
exports.getAssignment = getAssignment;
