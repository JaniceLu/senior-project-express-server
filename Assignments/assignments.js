const moment = require("moment");

const CREATE_ASSIGNMENT_QUERY = `INSERT INTO assignments SET ?`;
const CREATE_QUESTIONS_QUERY = `INSERT INTO questions (assignment_id,question,answer) VALUES ?`;
const createAssignment = (req, res, connection) => {
  const requestBody = req.body;
  console.log("Create Assignment body given: ");
  console.log(requestBody);
  connection.beginTransaction(function (err) {
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
      number_of_questions: requestBody.number_of_questions,
    };

    connection.query(CREATE_ASSIGNMENT_QUERY, assignmentData, function (
      error,
      results
    ) {
      if (error) {
        return connection.rollback(function () {
          console.log("Error inserting assignment");
          console.log(err);
          res.send({ failed: true });
        });
      }

      //MySQL inserting multiple records requires that all data is inside a 2D array
      const assignmentId = results.insertId;
      const questionData = requestBody.questions.map((obj) => [
        assignmentId,
        ...Object.values(obj),
      ]);

      //If assignment insertion was successful, work on inserting the questions next
      connection.query(CREATE_QUESTIONS_QUERY, [questionData], function (
        error
      ) {
        if (error) {
          return connection.rollback(function () {
            console.log("Error inserting questions");
            console.log(err);
            res.send({ failed: true });
          });
        }

        //If both operations succeed, commit the changes
        connection.commit(function (err) {
          if (err) {
            return connection.rollback(function () {
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

const GET_ASSIGNMENT_QUERY = `SELECT id, name, due_date FROM assignments WHERE id = ?`;
const GET_QUESTIONS_QUERY = `SELECT id, question, answer FROM questions WHERE assignment_id = ?`;
const getAssignment = (req, res, connection) => {
  const requestBody = req.body;
  console.log("Get Assignment body given: ");
  console.log(requestBody);
  connection.beginTransaction(function (err) {
    if (err) {
      console.log("Error viewing assignment transaction");
      console.log(err);
      res.send({ failed: true });
    }

    //Get assignment data first
    connection.query(GET_ASSIGNMENT_QUERY, requestBody.id, function (
      error,
      assignmentResults
    ) {
      if (error) {
        return connection.rollback(function () {
          console.log("Error viewing assignment");
          console.log(err);
          res.send({ failed: true });
        });
      }

      //If assignment read was successful, work on reading the questions next
      connection.query(GET_QUESTIONS_QUERY, requestBody.id, function (
        error,
        questionsResults
      ) {
        if (error) {
          return connection.rollback(function () {
            console.log("Error viewing questions");
            console.log(err);
            res.send({ failed: true });
          });
        }

        //If both reads succeed, put the results together
        connection.commit(function (err) {
          if (err) {
            return connection.rollback(function () {
              console.log("Error commiting create assignment transaction");
              console.log(err);
              res.send({ failed: true });
            });
          }

          //This happens when we ask for an ID that doesn't exist
          if (assignmentResults.length < 1) {
            console.log("Assignment was not found with the given id");
            res.send({ failed: true });
          } else if (questionsResults.length < 1) {
            console.log("Questions were not found with the given id");
            res.send({ failed: true });
          } else {
            console.log("Assignment has been retrieved!");
            const assignment = assignmentResults[0];
            const combinedResults = {
              assignment_name: assignment.name,
              due_date: assignment.due_date,
              assignment_id: assignment.id,
              questions: questionsResults,
            };
            res.send(combinedResults);
          }
        });
      });
    });
  });
};

const DELETE_ASSIGNMENT_QUERY = "DELETE FROM assignments WHERE id = ?";
const deleteAssignment = (req, res, connection) => {
  console.log("Delete Assignment body given: ");
  console.log(req.body);
  connection.query(DELETE_ASSIGNMENT_QUERY, req.body.id, function (
    err,
    results
  ) {
    if (err || results.affectedRows < 1) {
      console.log("Error deleting assignment");
      console.log(err);
      res.send({ failed: true });
    } else {
      console.log("Deleted assignment");
      res.send({ failed: false });
    }
  });
};

const replaceAssignment = (req, res, connection) => {
  const requestBody = req.body;
  console.log("Replace Assignment body given: ");
  console.log(requestBody);
  connection.beginTransaction(function (err) {
    if (err) {
      console.log("Error replacing assignment transaction");
      console.log(err);
      res.send({ failed: true });
    }

    //Work on inserting the assignments first
    const assignmentData = {
      class_id: requestBody.class_id,
      name: requestBody.name,
      due_date: requestBody.due_date,
      pub_date: moment().format("YYYY-MM-DD"),
      number_of_questions: requestBody.number_of_questions,
    };

    connection.query(CREATE_ASSIGNMENT_QUERY, assignmentData, function (
      error,
      results
    ) {
      if (error) {
        return connection.rollback(function () {
          console.log("Error inserting assignment");
          console.log(err);
          res.send({ failed: true });
        });
      }

      //MySQL inserting multiple records requires that all data is inside a 2D array
      const assignmentId = results.insertId;
      const questionData = requestBody.questions.map((obj) => [
        assignmentId,
        ...Object.values(obj),
      ]);

      //If assignment insertion was successful, work on inserting the questions next
      connection.query(CREATE_QUESTIONS_QUERY, [questionData], function (
        error
      ) {
        if (error) {
          return connection.rollback(function () {
            console.log("Error inserting questions");
            console.log(err);
            res.send({ failed: true });
          });
        }

        connection.query(
          DELETE_ASSIGNMENT_QUERY,
          requestBody.delete_id,
          function (err, results) {
            if (err || results.affectedRows < 1) {
              return connection.rollback(function () {
                console.log("Error deleting assignment");
                console.log(err);
                res.send({ failed: true });
              });
            }
            //If both operations succeed, commit the changes
            connection.commit(function (err) {
              if (err) {
                return connection.rollback(function () {
                  console.log("Error commiting create assignment transaction");
                  console.log(err);
                  res.send({ failed: true });
                });
              }
              console.log("Assignment has been replaced!");
              res.send({ failed: false });
            });
          }
        );
      });
    });
  });
};

const GET_ENROLLED_STATUS_QUERY = `SELECT * FROM roster WHERE firebase_id = ?`;
const GET_STUDENT_ASSIGNMENTS_QUERY = `SELECT assignment_id, name, due_date, number_of_questions, assignment_progress
FROM assignments asgn
JOIN student_assignment_progress prog ON asgn.id = prog.assignment_id
WHERE firebase_id = ?`;
const getStudentAssignments = (req, res, connection) => {
  const requestBody = req.body;
  console.log("Get Student Assignments body given: ");
  console.log(requestBody);
  connection.beginTransaction(function (err) {
    if (err) {
      console.log("Error viewing student assignments transaction");
      console.log(err);
      res.send({ failed: true });
    }

    //Grab roster status
    connection.query(
      GET_ENROLLED_STATUS_QUERY,
      requestBody.firebase_id,
      function (error, rosterResults) {
        if (error) {
          return connection.rollback(function () {
            console.log("Error viewing roster status");
            console.log(err);
            res.send({ failed: true });
          });
        }

        //Grab assignments
        connection.query(
          GET_STUDENT_ASSIGNMENTS_QUERY,
          requestBody.firebase_id,
          function (error, assignmentsResults) {
            if (error) {
              return connection.rollback(function () {
                console.log("Error viewing assignments");
                console.log(err);
                res.send({ failed: true });
              });
            }

            //If both reads succeed, put the results together
            connection.commit(function (err) {
              if (err) {
                return connection.rollback(function () {
                  console.log("Error commiting create assignment transaction");
                  console.log(err);
                  res.send({ failed: true });
                });
              }

              //Check student enrollment status
              if (rosterResults.length < 1) {
                console.log("Student has not applied for a class");
                res.send({ status: "none", assignments: [] });
              } else if (!rosterResults[0].accepted) {
                console.log("Student enrollment is pending");
                res.send({ status: "pending", assignments: [] });
              } else {
                console.log("Student is enrolled. Sending assignments...");
                res.send({
                  status: "accepted",
                  assignments: assignmentsResults,
                });
              }
            });
          }
        );
      }
    );
  });
};

exports.createAssignment = createAssignment;
exports.getAssignment = getAssignment;
exports.deleteAssignment = deleteAssignment;
exports.replaceAssignment = replaceAssignment;
exports.getStudentAssignments = getStudentAssignments;
