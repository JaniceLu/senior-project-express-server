const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const port = (process.env.PORT || 3000);
const connection = mysql.createConnection(process.env.DATABASE_URL);
const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM users';
const ADD_NEW_USER_QUERY = 'INSERT INTO users (firebase_id, school_id, name, is_teacher, email) VALUES ?'
app.use(cors());
connection.connect(function(err) { 
    console.log(process.env.DATABASE_URL);
    if(err) throw err;
    console.log("Connected!");
});

app.get('/', function (req, res) {
    connection.query(SELECT_ALL_PRODUCTS_QUERY, function (err, rows) {
        if (err) console.log(err);
        else { res.send(rows) }
    });
});

app.post('/signup', function(req, res) {
    var new_user = {
        firebase_id: req.params.firebase_id,
        school_id: req.params.school_id,
        name: req.params.name,
        is_teacher: req.params.is_teacher,
        email: req.params.email
    }
    connection.query(ADD_NEW_USER_QUERY, new_user, function (err, results) {
        if (err) res.send(err + "Could not sign up");
        else res.send(results);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));