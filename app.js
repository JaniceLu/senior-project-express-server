const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = (process.env.PORT || 3000);
const connection = mysql.createConnection(process.env.DATABASE_URL || process.env.DATABASE_URI);
const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM users';
const ADD_NEW_USER_QUERY = 'INSERT INTO users (firebase_id, school_id, name, is_teacher, email) VALUES ?'
app.use(bodyParser.json());
app.use(cors());
connection.connect(function(err) { 
    console.log(process.env.DATABASE_URL + " " + process.env.DATABASE_URI);
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
    console.log(req);
    var new_user = {
        firebase_id: req.body.firebase_id,
        school_id: req.body.school_id,
        name: req.body.name,
        is_teacher: req.body.is_teacher,
        email: req.body.email
    }
    connection.query(ADD_NEW_USER_QUERY, new_user, function (err, results) {
        if (err) res.send(err);
        else res.send(results);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));