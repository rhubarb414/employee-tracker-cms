const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "employees_db",
  },
  console.log(`Connected to the movies_db database.`)
);

//questions
const mainMenuList = [
  {
    type: "list",
    name: "menuChoice",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View ALl Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
];

const mainMenu = () => {
  inquirer
    .prompt(mainMenuList)
    .then((response) => {
      if (response.menuChoice === "View All Employees") {
        viewEmployees();
      } else {
        console.log("User chose " + response.menuChoice);
      }
    })
    .catch((err) => console.error(err));
};

mainMenu();

const viewEmployees = () => {
  db.query(
    `
  SELECT
  e.id
  , e.first_name
  , e.last_name
  , r.title
  , r.salary
  , d.name
  , concat(eb.first_name, " ", eb.last_name) AS manager

  FROM employee e

  JOIN role r
  ON r.id = e.role_id
  
  JOIN department d
  ON d.id = r.department_id

  LEFT JOIN employee eb
    ON eb.id = e.manager_id

  ORDER BY 1
  `,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
    }
  );
};
