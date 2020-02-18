const express = require('express');
const mysql = require('mysql');
const app = express();
const port = (process.env.PORT || 3000);
const connection = mysql.createConnection(process.env.DATABASE_URL);
const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM assignments';
connection.connect(function(err) { 
    console.log(process.env.DATABASE_URL);
    if(err) throw err;
    console.log("Connected!");
});

app.get('/', function (req, res) {
    connection.query(SELECT_ALL_PRODUCTS_QUERY, function (err, rows, fields) {
        if (err) console.log(err);
        else { res.send(rows) }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));