const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = (process.env.PORT || 3000);
const connection = mysql.createConnection(process.env.DATABASE_URL || process.env.DATABASE_URI);
const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM users';
const ADD_NEW_USER_QUERY = 'INSERT INTO users SET ?';
const ADD_NEW_CLASS_QUERY = 'INSERT INTO classes SET ?';
const GET_USER_INFO_QUERY = 'SELECT firebase_id, is_teacher from users WHERE firebase_id = ?';
const UPDATE_USER_INFO_QUERY = 'UPDATE users SET ? WHERE firebase_id = ?';
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(cors());

connection.connect(function(err) { 
    console.log(process.env.DATABASE_URL);
    if(err) {
        console.log(err);
        throw err;
    }
    console.log("Connected!");
});

app.get('/', function (req, res) {
    connection.query(SELECT_ALL_PRODUCTS_QUERY, function (err, rows) {
        if (err) console.log(err);
        else { 
            console.log(rows); 
            res.send(rows);
        }
    });
});

app.post('/signup', function(req, res) {
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

app.post('/signin', function(req, res) {
    console.log(req.body);
    connection.query(GET_USER_INFO_QUERY, req.body.firebase_id, function (err, results) {
        if (err) {
            console.log("didn't work");
            console.log(err);
            res.send(err);
        } else {
            if(results && results.length) {
                console.log("user has been found");
                console.log(results);
                res.send(results);
            } else {
                console.log("no user with firebase id: " + req.body.firebase_id);
                console.log(results);
                res.send(results);
            }
        }
    })
});

app.get('/login', function(req, res) {

});

//changed so that all parameters are needed for update
app.post('/updateprofile', function(req, res) {
    console.log(req.body);
    var updatedInfo = {
        school_id: req.body.school_id,
        name: req.body.name,
        email: req.body.email
    }
    connection.query(UPDATE_USER_INFO_QUERY, [updatedInfo, req.body.firebase_id], function (err, results) {
        if (err) {
            console.log("didn't work");
            console.log(err);
            res.send(err);
        } else {
            if(results) {
                console.log("user info has been changed");
                console.log(results);
                res.send(results);
            } else {
                console.log("user info has not been changed");
                console.log(results);
                res.send(results);
            }
        }
    });
})

app.post('/createclass', function(req, res) {
    console.log(req.body);
    var newClass = {
        firebase_id: req.body.firebase_id,
        class_title: req.body.class_title,
        class_year: req.body.class_year
    }
    connection.query(ADD_NEW_CLASS_QUERY, newClass, function (err, results) {
        if (err) {
            console.log("didn't work");
            console.log(err);
            res.send(err);
        } else {
            if(results) {
                console.log("class has been added");
                console.log(results);
                res.send(results);
            } else {
                console.log("could not add class");
                console.log(results);
                res.send(results);
            }
        }
    })
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

