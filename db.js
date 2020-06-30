const postgres = require("pg");
const db = new postgres.Pool({
    database: "gmdb",
    user: "gmdb_app",
    password: "123",
    host: "localhost",
    port: 5432
});

module.exports = db;