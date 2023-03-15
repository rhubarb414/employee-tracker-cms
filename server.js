const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Tried using a class to make the view deparments query.
// It cleans up this server file, but not sure this is what was intended.
const View = require("./lib/view");
const view = new View();

let deptArr = []; // for helper function updateDeptArr()
let roleArr = []; // for helper function updateRoleArr()

// for helper function updateEmpArr()
// initialized with "None" because this list is used when assigning a manager
// to a new employee
let empArr = ["None"];

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

// Add new employee prompts for inquirer
const askForEmployee = [
  {
    type: "input",
    name: "firstName",
    message: "Enter new employee's first name",
    validate(value) {
      if (!value) {
        return "Name cannot be empty";
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    name: "lastName",
    message: "Enter last name",
    validate(value) {
      if (!value) {
        return "Name cannot be empty";
      } else {
        return true;
      }
    },
  },

  {
    type: "list",
    name: "role",
    message: "Choose employee's role",
    choices: roleArr,
  },

  {
    type: "list",
    name: "manager",
    message: "Enter employee's manager",
    choices: empArr,
  },
];

// Update role prompts for inquirer
const askForEmpNewRole = [
  {
    type: "list",
    name: "employee",
    message: "Choose employee to update",
    choices: empArr,
  },

  {
    type: "list",
    name: "role",
    message: "Choose employee's role",
    choices: roleArr,
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
        view.getDepartments(); // attempt with imported code
        mainMenu(); // delete if using viewDepartments()
      } else if (response.menuChoice === "Add Department") {
        addDepartment();
      } else if (response.menuChoice === "Add Role") {
        addRole();
      } else if (response.menuChoice === "Add Employee") {
        addEmployee();
      } else if (response.menuChoice === "Update Employee Role") {
        updateEmpRole();
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

const addRole = async () => {
  const newRole = await inquirer.prompt(askForRole);
  // Compute dept ID from dept name by looking at deptArr
  const deptID =
    deptArr.findIndex((element) => element === newRole.department) + 1;

  // Insert the new role
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
    .then(() => updateRoleArr())
    .then(() => mainMenu());
};

const addEmployee = async () => {
  const newEmployee = await inquirer.prompt(askForEmployee);
  //   Compute dept ID from dept name by looking at deptArr
  const roleID =
    roleArr.findIndex((element) => element === newEmployee.role) + 1;

  // Index in empArr doesn't need +1 because "None" is at position 0
  let mgrID = empArr.findIndex((element) => element === newEmployee.manager);

  // Handle the case employee has no manager
  if (mgrID === "None") {
    mgrID = null;
  }

  // Insert the new role
  db.promise()
    .query(
      `
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${newEmployee.firstName}", "${newEmployee.lastName}", ${roleID}, ${mgrID})
                `
    )
    .then(() =>
      console.log(`
                Employee "${newEmployee.firstName} ${newEmployee.lastName}" added
                `)
    )
    .catch((err) => console.log(err))
    .then(() => updateEmpArr())
    .then(() => mainMenu());
};

const updateEmpRole = async () => {
  const roleUpdate = await inquirer.prompt(askForEmpNewRole);
  //   Compute dept ID from dept name by looking at deptArr
  const roleID =
    roleArr.findIndex((element) => element === roleUpdate.role) + 1;

  // Index in empArr doesn't need +1 because "None" is at position 0
  let empID = empArr.findIndex((element) => element === roleUpdate.employee);

  // Handle the case user chose "none" for the employee
  if (empID === "None") {
    return console.log(`Employee "${empID}" not found`);
  }

  // Update employee in db
  db.promise()
    .query(
      `UPDATE employee
    SET role_id = ${roleID}
    WHERE id = ${empID};`
    )
    .then(() =>
      console.log(`
              Employee role for "${roleUpdate.employee}" updated to ${roleUpdate.role}
              `)
    )
    .catch((err) => console.log(err))
    .then(() => mainMenu());
};

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

// Helper function to pull roles into an array
const updateRoleArr = () => {
  db.query(` SELECT title FROM role`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.forEach((role) => {
      // Check if there is a new role in the table before adding to roleArr
      if (!roleArr.includes(role.title)) {
        roleArr.push(role.title);
      }
    });
  });
};

// Helper function to pull employees into an array
const updateEmpArr = () => {
  db.query(` SELECT first_name, last_name FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    result.forEach((name) => {
      concatName = name.first_name + " " + name.last_name;
      //   Check if there is a new employee in the table before adding to empArr
      if (!empArr.includes(concatName)) {
        empArr.push(concatName);
      }
    });
  });
};

// Initialize program
const init = () => {
  updateDeptArr();
  updateRoleArr();
  updateEmpArr();
  mainMenu();
};
init();
