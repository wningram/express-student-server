const db = require("./db");

function FindStudent(id) {
    db.query("SELECT * FROM students WHERE id = " + id, (err, result) => {
        if (err) throw err;
        return result.rows[0];
    }); 
};

function GetData() {
    db.query("SELECT * FROM students", (err, result) => {
        if (err) throw err;
        console.log(result.rows);
    });
}

module.exports = {
    GetData: GetData,
    FindStudent: FindStudent
};