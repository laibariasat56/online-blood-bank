const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "bloodbank"
});

db.connect(err => {
  if(err) console.log(err);
  else console.log("Connected to MySQL Database");
});

module.exports = db;