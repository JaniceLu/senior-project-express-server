const CREATE_ASSIGNMENT_QUERY = `INSERT INTO assignments SET ?`;
const CREATE_QUESTIONS_QUERY = `INSERT INTO questions (assignment_id,question,answer) VALUES ?`;

const createAssignment = (req, res) => {
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
}


const _createAssignment = createAssignment;
const _getAssignment = getAssignment;
const _updateAssignment = updateAssignment;
const _deleteAssignment = deleteAssignment;


export { _createAssignment as createAssignment };
export { _getAssignment as getAssignment };
export { _updateAssignment as updateAssignment };
export { _deleteAssignment as deleteAssignment };
