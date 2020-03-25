const GET_ROSTER_INFO_QUERY = 'SELECT * from roster where firebase_id = ?';
const getRoster = (req, res, connection) => {
    console.log("View roster body given: ");
    console.log(req.body);
    connection.query(GET_ROSTER_INFO_QUERY, req.body.firebase_id, function(
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
                res.send({ failed: true});
            }
        }
    });
};

exports.getRoster = getRoster;