const ADD_NEW_USER_QUERY = "INSERT INTO roster SET ?";
const addUser = (req, res, connection) => {
    console.log("Add user body given: ");
    console.log(req.body);
    var userData = {
        id: req.body.id,
        firebase_id: req.body.firebase_id
    }
    connection.query(
        ADD_NEW_USER_QUERY,
        userData,
        function(
            err,
            results
        ) {
            if (err) {
                console.log("Error adding user to class");
                console.log(err);
                res.send({ failed: true });
            } else {
                if (results) {
                   console.log("User has been added"); 
                   console.log(results);
                   res.send({ failed: false });
                } else {
                    console.log("User has not been added to the roster"); //should not happen since ids are checked b4hand
                    console.log(results);
                    res.send({ failed: true });
                }
            }
        });
};

const GET_ROSTER_INFO_QUERY = 'SELECT * from roster where firebase_id = ?';
const getRoster = (req, res, connection) => {
    console.log("View roster body given: ");
    console.log(req.body);
    connection.query(
        GET_ROSTER_INFO_QUERY, 
        req.body.firebase_id, 
        function(
            err,
            results
        ) {
            if (err) {
                console.log("Error retrieving roster");
                console.log(err);
                res.send({ failed: true });
            } else {
                if (results) {
                    if (results.length) {
                        console.log("Roster has been found and has students");
                    } else {
                        console.log("Your class has no students");
                    }
                    console.log(results);
                    res.send(results);
                } else {
                    console.log("Could not find roster"); //should never reach here, couldnt find the firebase_id
                    console.log(results);
                    res.send({ failed: true });
                }
            }
        });
};

const DELETE_USER_QUERY = "DELETE from roster where firebase_id = ?";
const deleteUser = (req, res, connection) => {
    console.log("Delete User body given: ");
    console.log(req.body);
    connection.query(
        DELETE_USER_QUERY, 
        req.body.firebase_id, 
        function (
            err, 
            results
        ) {
            if (err) {
                console.log("Error deleting user from class");
                console.log(err);
                res.send({ failed: true });
            } else {
                console.log("Delete user from class");
                console.log(results);
                res.send({ failed: false });
            }
    });
};

exports.addUser = addUser;
exports.getRoster = getRoster;
exports.deleteUser = deleteUser;