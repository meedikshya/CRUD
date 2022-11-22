

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

app.get("/new-submit", (req, res) => {
    res.render("submit");
})

/*app.get("/delete", (req, res) => {
    res.render("delete");
})*/



//static files 
app.use(express.static('public'));
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

//get and post methods for formm, new data update

app.get('/api/new-submit', (req, res) => {
    // mysqlConnection.query('SELECT * FROM students WHERE id=?', [req.params.id], (err, row, fields) => {
    // if (!err) {
    // res.send(row);
    res.render('submit');
    // }
    // else {
    //throw err;
    // console.log(err);
    // }
    // });

});

app.post('/api/new-submit', (req, res) => {
    mysqlConnection.query('INSERT INTO students(Name,email,phone) values(?,?,?)', [req.body.name, req.body.email, req.body.phone], (err, response) => {
        if (!err) {
            res.send('Record has been inserted successfully');
        }
        else {
            //console.log(err);
            throw err;
        }

    });
});




app.post('/api/students', (req, res) => {
    mysqlConnection.query('INSERT INTO students(Name,email,phone) values(?,?,?)', [req.body.namee, req.body.email, req.body.phone], (err, response) => {
        if (!err) {
            res.send('Record has been inserted successfully');
        }
        else {
            //console.log(err);
            throw err;
        }
        //var mysql = "UPDATE students sets Name=?, email=?, phone=? where id=?";
        //res.redirect('/api/students');
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


//get and post method for edit

app.get('/api/edit/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM students WHERE id=?', [req.params.id], (err, row, fields) => {
        if (!err) {
            //res.send(row);
            var datas = row[0];
            res.render('form', { datas: datas, userId: req.params.id });
        }
        else {
            //throw err;
            console.log(err);

        }
    });
});

app.post('/api/edit/:id', (req, res) => {
    mysqlConnection.query('UPDATE students set Name=?,email=?,phone=? where id=?', [req.body.name, req.body.email, req.body.phone, req.params.id], (err, response) => {
        if (!err) {
            res.send('Record has been updated successfully');
        }
        else {
            //console.log(err);
            throw err;
        }
    });
})


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


//methods for deleting data


app.get('/api/delete/:id', (req, res) => {
    mysqlConnection.query('select * FROM students WHERE id=?', [req.params.id], (err, row, fields) => {
        if (row.length != 1) {
            res.send("This donot exist");
            console.log(row.length);
        }
        else if (row.length == 1) {
            console.log(row.length);
            mysqlConnection.query('Delete FROM students WHERE id=?', [req.params.id], (err, row, fields) => {
                res.send("Record has been Deleted");
            });

        }
        else {
            throw err;
        }
    });

})

app.delete('/api/delete/:id', (req, res) => {
    mysqlConnection.query('select * FROM students WHERE id=?', [req.params.id], (err, row, fields) => {
        if (row.length != 1) {
            res.send("This donot exist");
            console.log(row.length);
        }
        else if (row.length == 1) {
            console.log(row.length);
            mysqlConnection.query('Delete FROM students WHERE id=?', [req.params.id], (err, row, fields) => {
                res.send("Record has been Deleted");
            });

        }
        else {
            throw err;
        }
    });

})


app.listen(3000, () => {
    console.log("Express is running on localhost: 3000");
});

