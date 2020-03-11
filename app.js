const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const port = (process.env.PORT || 3000);
const connection = mysql.createConnection(process.env.DATABASE_URL);
const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM users';
const ADD_NEW_USER_QUERY = 'INSERT INTO users (firebase_id, name, school_id, is_teacher, email) VALUES ?'
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
        firebase_id: req.body.firebase_id,
        name: req.body.name,
        school_id: req.body.school_id,
        is_teacher: req.body.is_teacher,
        email: req.body.email
    }
    connection.query(ADD_NEW_USER_QUERY, new_user, function (err, results, fields) {
        if (err) res.send({new_user});
        else {
            console.log("Added user");
            res.send("Added user");
            connection.end();
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));