const Student = require("./student");
const utils = require("./utils");
const express = require("express");
const db = require("./db");
const app = express();
const port = 8080;

const students = [
    new Student(1, "Becky G.", [92, 13, 80]),
    new Student(2, "John G.", [80, 25, 90]),
    new Student(3, "Luke Skywalker", [100, 100, 100]),
    new Student(4, "Ewan McGregor", [200, 300, 1000])
];

app.get("/", (req, resp) => {
    let data = utils.GetData();
    resp.json(data);
});

app.get("/students", (req, resp) => {
    let search = req.query.search;
    if (search) {
        db.query(`SELECT * FROM students WHERE name LIKE '%${search}%'`, (err, result) => {
            if (err) throw err;
            console.log(result.rows);
            if (result.rows.length > 0) {
                resp.json(result.rows[0]);
            }
            else
                resp.status(404).send("No students found.");
        });
    } else {
        db.query("SELECT * FROM students", (err, result) => {
            if (err) throw err;
            if (result.rows) resp.json(result.rows);
            else resp.send("THere are no records.");
        })
    }
})

app.get("/students/:studentId", (req, resp) => {
    let studentId = req.params.studentId;
    db.query("SELECT * FROM students WHERE id = " + studentId, (err, result) => {
        if (err) throw err;
        console.log(result.rows);
        if (result.rows.length != 0) {
            resp.json(result.rows);
        } else {
            resp.status(404).send(`Could not find student with Id '${studentId}'.`);
        }
    });
});

app.get("/grades/:studentId", (req, resp) => {
    let studentId = req.params.studentId;
    db.query("SELECT * FROM students WHERE id = " + studentId, (err, result) => {
        if (err) throw err;
        console.log(result.rows);
        if (result.rows.length > 0) {
            resp.json({
                student: result.rows[0].name,
                grades: result.rows[0].grades
            });
        } else {
            resp.status(404).send(`Could not find student with Id '${studentId}'.`);
        }
    });
});

app.post("/grades", (req, resp) => {
    let studentId = req.query.studentId;
    let grade = req.query.grade;
    if (!studentId || grade == undefined) {
        resp.status(400).send("Invalid arguments.");
        return;
    }
    db.query(`SELECT * FROM students WHERE id = ${studentId}`, (err, result) => {
        if (err) throw err;
        console.log(result.rows);
        if (result.rows.length > 0) {
            db.query(`UPDATE students SET grades = CONCAT(grades, ', ${grade}') WHERE id = ${studentId}`, (err, result) => {
                if (err) throw err;
                console.log(result.rows);
                resp.sendStatus(200);
            });
        } else {
            resp.status(404).send(`Could not find user with Id '${studentId}'.`);
        }
    });
});

app.post("/register", (req, resp) => {
    let studentId = req.query.studentId;
    let name = req.query.name;
    let email = req.query.email;
    if (studentId == undefined || !name || !email) {
        resp.status(400).send("Invalid arguments");
        return;
    }

    // Check if student id already exists
    db.query(`SELECT * FROM students WHERE id = ${studentId}`, (err, result) => {
        if (err) throw err;
        if (result.rows.length > 0) {
            resp.status(409).send(`User with Id '${studentId}' already exists.`);
        } else {
            db.query(`INSERT INTO students VALUES (${studentId}, '${name}', '', '${email}')`, (err, result) => {
                if (err) throw err;
                resp.sendStatus(201);
            });
        }
    });
});

app.listen(port);