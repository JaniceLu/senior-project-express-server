const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = (process.env.PORT || 3000);
const connection = mysql.createConnection(process.env.DATABASE_URL || process.env.DATABASE_URI);
const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM users';
const ADD_NEW_USER_QUERY = 'INSERT INTO users SET ?'
app.use(bodyParser.raw());
app.use(bodyParser.json());
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
    console.log(req.body);
    var new_user = JSON.stringify({
        firebase_id: req.body.firebase_id,
        school_id: req.body.school_id,
        name: req.body.name,
        is_teacher: req.body.is_teacher,
        email: req.body.email
    });
    connection.query(ADD_NEW_USER_QUERY, new_user, function (err, results) {
        if (err) {
            console.log("didn't work");
            console.log(err);
            res.send(err);
        }
        else {
            console.log("it worked"); 
            res.send(results);
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
