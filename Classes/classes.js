const ADD_NEW_CLASS_QUERY = "INSERT INTO classes SET ?";
const createClass = (req, res) => {
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
        console.log("Could not add class"); //Probably never happens
        console.log(results);
        res.send({ failed: true });
      }
    }
  });
};

const GET_CLASS_INFO_QUERY =
  "SELECT id, name, due_date, pub_date from assignments WHERE class_id = ?";
const getClass = (req, res) => {
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
        console.log("Could not find class"); //If we couldn't find the ID
        console.log(results);
        res.send({ failed: true });
      }
    }
  });
};

const UPDATE_CLASS_INFO_QUERY = "UPDATE classes SET ? WHERE id = ?";
const updateClass = (req, res) => {
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
          console.log("Class info has not been changed"); //This means the query went through, but didn't change anything
          console.log(results);
          res.send({ failed: true });
        }
      }
    }
  );
};

const DELETE_CLASS_QUERY = "DELETE FROM classes where id = ?";
const deleteClass = (req, res) => {
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
};

exports.createClass = createClass;
exports.getClass = getClass;
exports.updateClass = updateClass;
exports.deleteClass = deleteClass;