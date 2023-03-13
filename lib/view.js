mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

class View {
  getDepartments() {
    db.query(` SELECT * FROM department`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("\n");
      console.table(result);
    });
  }
}

module.exports = View;
