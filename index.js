

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const exphbs = require('hbs')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//template engine
//to set the view engine
app.set('view engine', 'hbs');

//template engine route
app.get("/", (req, res) => {
    res.render('index')

});

//static files 
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'));


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studentdb',
    multipleStatements: true
});


mysqlConnection.connect((err) => {
    if (!err) {
        console.log('Connection Established');
    }
    else {
        console.log('Connection failed');
    }
})


app.post('/student', (req, res) => {
    mysqlConnection.query('INSERT INTO students(Name,email,phone) values(?,?,?)', [req.body.Name, req.body.email, req.body.phone], (err, response) => {
        if (!err) {
            res.send('Record has been inserted successfully');
        }
        else {
            throw err;
        }
    });
});


app.get('/students', (req, res) => {
    mysqlConnection.query('SELECT * FROM students', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        }
        else {
            throw err;
        }
    });
});


app.get('/students/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM students WHERE id=?', [req.params.id], (err, row, fields) => {
        if (!err) {
            res.send(row);
        }
        else {
            throw err;
        }
    });
});


app.put('/students/:id', (req, res) => {
    mysqlConnection.query('UPDATE students SET phone =? WHERE id=?', [req.body.phone, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send("Record has been Updated");
        }
        else {
            throw err;
        }
    });
});



app.delete('/students/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM students WHERE id=?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send("Record has been Deleted");
        }
        else {
            throw err;
        }
    });
});


app.listen(3000, () => {
    console.log("Express is running on localhost: 3000");
});