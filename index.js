

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
    res.render('index', { title: "Hellloooo" })
});

app.get("/students", (req, res) => {
    data = req.data;
    res.render('data', { data: data });
});

app.get("/student", (req, res) => {
    res.render('individual1', { data: data })
});

app.get("/edit", (req, res) => {
    res.render('form');
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


app.post('/api/student', (req, res) => {
    mysqlConnection.query('INSERT INTO students(Name,email,phone) values(?,?,?)', [req.body.Name, req.body.email, req.body.phone], (err, response) => {
        if (!err) {
            res.send('Record has been inserted successfully');
        }
        else {
            throw err;
        }
    });
});


app.get('/api/students', (req, res) => {
    mysqlConnection.query('SELECT * FROM students', (err, rows, fields) => {
        if (!err) {
            //res.send(rows);
            var datas = rows;
            // res.send(rows);
            res.render('data', { datas: datas });

            // res.render('data');
        }
        else {
            // throw err;
            console.log(err);
        }
    });
});


app.get('/api/students/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM students WHERE id=?', [req.params.id], (err, row, fields) => {
        if (!err) {
            // res.send(row);
            var datas = row;
            res.render('individual1', { datas: datas[0] });
        }
        else {
            //throw err;
            console.log(err);

        }
    });
});

app.get('/api/edit/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM students WHERE id=?', [req.params.id], (err, row, fields) => {
        if (!err) {
            //res.send(row);
            var datas = row[0];
            res.render('form', { datas: datas });
        }
        else {
            //throw err;
            console.log(err);

        }
    });
});


app.put('/api/students/:id', (req, res) => {
    mysqlConnection.query('UPDATE students SET phone =? WHERE id=?', [req.body.phone, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send("Record has been Updated");
        }
        else {
            throw err;
        }
    });
});



app.delete('/api/students/:id', (req, res) => {
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