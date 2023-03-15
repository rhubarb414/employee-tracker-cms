const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Tried using a class to make the view deparments query.
// It cleans up this server file, but not sure this is what was intended.
const View = require("./lib/view");
const newView = new View();

let deptArr = []; //for helper function updateDeptArr()

// Connect to database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "employees_db",
  }
  //   console.log(`Connected to the employees_db database.`) // delete
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

// Add new department prompt for inquirer
const askForDepartment = [
  {
    type: "input",
    name: "department",
    message: "Enter new department name",
    validate(value) {
      if (!value) {
        return "Name cannot be empty";
        // Would be handy to validate on whether dept exists already
      } else if (deptArr.includes(value)) {
        return "Department already exists";
      } else {
        return true;
      }
    },
  },
];

// Add new role prompts for inquirer
const askForRole = [
  {
    type: "input",
    name: "title",
    message: "Enter new role title",
    validate(value) {
      if (!value) {
        return "Name cannot be empty";
        // Would be handy to validate on whether dept exists already
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    name: "salary",
    message: "Enter role salary",
    validate(value) {
      if (!value) {
        return "Salary cannot be empty";
        //   } else if (typeof value !== "number") {
        //     return `Salary must be a number, returned ${typeof value}`; // doesn't work, stores as string
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    name: "department",
    message: "Enter role department",
    validate(value) {
      if (!value) {
        return "Department cannot be empty";
      } else if (!deptArr.includes(value)) {
        return `Department "${value}" doesn't exist`;
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
      } else if (response.menuChoice === "Add Role") {
        addRole();
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
        .then(() => updateDeptArr()) // Add new department to deptArr
        .then(() => mainMenu());
    })
    .catch((err) => console.error(err));
};

// Add role using a promise
// const addRole = () => {
//   inquirer
//     .prompt(askForRole)
//     .then(async (response) => {
//       const deptID = await getDeptID(response.department);
//       console.log("dept ID = " + deptID);

//       db.promise()
//         .query(
//           `
//           INSERT INTO role (title, salary, department_id)
//           VALUES ("${response.title}", ${response.salary}, ${deptID})
//           `
//         )
//         .then(() =>
//           console.log(`
//           Role "${response.title}" added
//           `)
//         )
//         .catch((err) => console.log(err))
//         .then(() => mainMenu());
//     })
//     .catch((err) => console.error(err));
// };

// const addRole = async () => {
//   const newRole = await inquirer.prompt(askForRole);
//   //   console.log(newRole.department);
//   const deptID = await getDeptID(newRole.department);
//   console.log("dept ID = " + deptID);

//   db.promise()
//     .query(
//       `
//               INSERT INTO role (title, salary, department_id)
//               VALUES ("${newRole.title}", ${newRole.salary}, ${deptID})
//               `
//     )
//     .then(() =>
//       console.log(`
//               Role "${newRole.title}" added
//               `)
//     )
//     .catch((err) => console.log(err))
//     .then(() => mainMenu());
// };

const addRole = async () => {
  const newRole = await inquirer.prompt(askForRole);
  //   console.log(newRole.department);
  const deptID = await getDeptID(newRole.department);
  console.log("dept ID = " + deptID);

  db.promise()
    .query(
      `
                INSERT INTO role (title, salary, department_id)
                VALUES ("${newRole.title}", ${newRole.salary}, ${deptID})
                `
    )
    .then(() =>
      console.log(`
                Role "${newRole.title}" added
                `)
    )
    .catch((err) => console.log(err))
    .then(() => mainMenu());
};

// // Helper function get department id from department name.
// // Takes a string
// const getDeptID = async (name) => {
//   const rowID = await db
//     .promise()
//     .query(`SELECT * FROM department`)
//     .then((response) => {
//       //response[0] is the table object
//       response[0].forEach((row) => {
//         if (row.name === name) {
//           console.log(row.id);
//           return row.id;
//         }
//       });
//     })
//     .catch((err) => console.log(err));
//   return rowID;
// };

const getDeptID = (name) => {
  db.promise()
    .query(`SELECT * FROM department`)
    .then((response) => {
      //response[0] is the table object
      response[0].forEach((dept) => {
        if (dept.name === name) {
          console.log(dept.id);
          return dept.id;
        }
      });
    })
    .catch((err) => console.log(err));
};

const thingOne = getDeptID("Finance"); // delete
console.log("thing one = " + thingOne); //delete

// Helper function to pull departments into an array
const updateDeptArr = () => {
  db.query(` SELECT name FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.forEach((dept) => {
      // Check if there is a new department in the table before adding to deptArr
      if (!deptArr.includes(dept.name)) {
        deptArr.push(dept.name);
      }
    });
  });
};

// Helper function get department id from department name.
// Takes a string
// const getDeptID = (name) => {

//   db.query(` SELECT * FROM department`, (err, table) => {
//     if (err) {
//       console.log(err);
//     }
//     table.forEach((row) => {
//       if (row.name === name) {
//         console.log(row.id);
//         return row.id;
//       }
//     });
//   });
// };

// Initialize program
const init = () => {
  updateDeptArr();
  mainMenu();
};
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
