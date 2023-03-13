const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Tried using a class to make the view deparments query.
// It cleans up this server file, but not sure this is what was intended.
const View = require("./lib/view");
const newView = new View();

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

// Main menu options for inquirer
const mainMenuList = [
  {
    type: "list",
    name: "menuChoice",
    message: `
What would you like to do?
    `,
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
];

// Add new department field for inquirer
const askForDepartment = [
  {
    type: "input",
    name: "department",
    message: "Enter new department name",
    validate(value) {
      if (!value) {
        return "Name cannot be empty";
        // Would be handy to validate on whether dept exists already
      } else {
        return true;
      }
    },
  },
];

// Handle user responses from main menu and call corresponding queries
const mainMenu = () => {
  inquirer
    .prompt(mainMenuList)
    .then((response) => {
      if (response.menuChoice === "View All Employees") {
        viewEmployees();
      } else if (response.menuChoice === "View All Roles") {
        viewRoles();
      } else if (response.menuChoice === "View All Departments") {
        // viewDepartments();
        newView.getDepartments(); // attempt with imported code
        mainMenu(); // delete if using viewDepartments()
      } else if (response.menuChoice === "Add Department") {
        addDepartment();
      } else {
        console.log("User chose " + response.menuChoice);
      }
    })
    .catch((err) => console.error(err));
};

// Show all employees with their id, first name, last name, job title,
// department, salary, and manager
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
      mainMenu();
    }
  );
};

// Show all roles with their title, id, department and salary
const viewRoles = () => {
  db.query(
    `
  SELECT
  role.title
  , role.id
  , department.name AS department
  , role.salary

  FROM role 

  JOIN department 
  ON department.id = role.department_id
  
  ORDER BY 2
  `,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
      mainMenu();
    }
  );
};

// ~~ Not in use. Using ./lib/view.js~~

// // View all departments and their id
// const viewDepartments = () => {
//   db.query(` SELECT * FROM department`, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log("\n");
//     console.table(`"${result}"`);
//     mainMenu();
//   });
// };

//addDepartment using a promise
const addDepartment = () => {
  inquirer
    .prompt(askForDepartment)
    .then((response) => {
      db.promise()
        .query(
          `
        INSERT INTO department (name)
        VALUES ("${response.department}")
        `
        )
        .then(() =>
          console.log(`
        Department "${response.department}" added
        `)
        )
        .catch((err) => console.log(err))
        .then(() => mainMenu());
    })
    .catch((err) => console.error(err));
};

// Initialize program
const init = () => mainMenu();
init();

// ~~~~~~
// const addDepartment = () => {
//   inquirer
//     .prompt(askForDepartment)
//     .then((response) => {
//       db.query(
//         `
//       INSERT INTO department (name)
//       VALUES ("${response.department}")
//       `,
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           }
//           console.table(result);
//         }
//       );
//     })
//     .catch((err) => console.error(err));
// };
