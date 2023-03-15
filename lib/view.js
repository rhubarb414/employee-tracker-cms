mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "employees_db",
});

class View {
  // show all departments in the console
  getDepartments() {
    db.query(` SELECT * FROM department`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("\n"); //add linebreak so table column names don't get put on same line as inquirer instructions
      console.table(result);
    });
  }
}

module.exports = View;
