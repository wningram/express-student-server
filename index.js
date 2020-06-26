const Student = require("./student");
const express = require("express");
const app = express();
const port = 8080;

const students = [
    new Student(1, "Becky G.", [92, 13, 80]),
    new Student(2, "John G.", [80, 25, 90]),
    new Student(3, "Luke Skywalker", [100, 100, 100]),
    new Student(4, "Ewan McGregor", [200, 300, 1000])
];

app.get("/", (req, resp) => {
    resp.send("Hello");
});

app.get("/students", (req, resp) => {
    if (req.query.search) {
        let result = students.find((val, ndx, obj) => {
            return val.name.toLowerCase().match(new RegExp(`.*${req.query.search}.*`));
        });
        if (result)
            resp.send("Student: " + result.name);
        else
            resp.status(404).send("No students found.");
    } else {
        let result = "Students:<br/><br/>";
        for (let student of students) {
            result += `${student.name}<br/>`;
        }
        resp.send(result);
    }
});

app.get("/students/:studentId", (req, resp) => {
    let studentId = req.params.studentId;
    let result = students.find((val, ndx, obj) => {
        return val.id == studentId;
    });
    console.log(result);
    if (result)
        resp.json(result);
    else
        resp.status(404).send(`Student with Id '${studentId}' does not exist.`);
});

app.get("/grades/:studentId", (req, resp) => {
    let studentId = req.params.studentId;
    let result = students.find((val) => {
        return val.id == studentId
    });
    console.log(result);
    if (result)
        resp.json({
            student: result.name,
            grades: result.grade
        });
    else
        resp.status(404).send(`Student with Id '${studentId}' does not exist.`);
});

app.post("/grades", (req, resp) => {
    let studentId = req.query.studentId;
    let grade = req.query.grade;
    if (!studentId || grade == undefined) {
        resp.status(400).send("Invalid arguments.");
        return;
    }
    let student = students.find((val) => val.id == studentId);
    console.log(student);
    if (student) {
        resp.status(200).json({
            response: 200
        });
    } else {
        resp.status(404).send(`Student with Id '${studentId}' does not exist.`);
    }
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
    let student = students.find((val) => val.id == studentId);
    if (student) {
        resp.status(409).send(`User with Id '${studentId}' already exists.`);
        return;
    } else {
        resp.status(200).json({response: 200});
    }
});

app.listen(port);