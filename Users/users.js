const ADD_NEW_USER_QUERY = "INSERT INTO users SET ?";
const addUser = (req, res) => {
    console.log("Sign Up body given: ");
    console.log(req.body);
    var new_user = {
        firebase_id: req.body.firebase_id,
        school_id: req.body.school_id,
        name: req.body.name,
        is_teacher: req.body.is_teacher,
        email: req.body.email
    };
    connection.query(ADD_NEW_USER_QUERY, new_user, function (err, results) {
        if (err) {
            console.log("Error adding user");
            console.log(err);
            res.send({ failed: true });
        } else {
            console.log("Inserted User");
            res.send({ failed: false });
        }
    });
}

const GET_USER_INFO_QUERY = "SELECT * from users WHERE firebase_id = ?";
const getUserInfo = (req, res) => {
    console.log("Sign In body given: ");
    console.log(req.body);
    connection.query(GET_USER_INFO_QUERY, req.body.firebase_id, function (
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
}

const UPDATE_USER_INFO_QUERY = "UPDATE users SET ? WHERE firebase_id = ?";
const updateUserInfo = (req, res) => {
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
            console.log("User info has not been changed"); //This means the query went through but changed nothing
            console.log(results);
            res.send({ failed: true });
            }
        }
    });
}




const _addUser = addUser;
const _getUserInfo = getUserInfo;
const _updateUserInfo = updateUserInfo;

export { _addUser as addUser };
export { _getUserInfo as getUserInfo };
export { _updateUserInfo as updateUserInfo };