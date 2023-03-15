# Employee Tracker Content Management System

## Description

This is a CLI app that shows employees, roles, and departments from a database. These items can also be updated by the user.

This project helped me hone my node skills as well as my implementation of mySQL. I felt the actual SQL code was pretty straightforward, but I got really hung up on how to convert IDs <--> Names in a way I could use them.

I created this Employee Tracker based on the following acceptance critiera:

```
GIVEN a command-line application that accepts user input

WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids

WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including _employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to_

WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database

WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

## Installation

After cloning the repo, be sure to install dependencies. Then run the schema and seeds files in mySQL. To start the app, run the server.js file in the command line.

## Usage

Follow the prompts in the command line. See this demo video:
[https://drive.google.com/file/d/17z5z5D2lLt4GcJBUQZ1-9KBn_eV5Q640/view?usp=sharing](https://drive.google.com/file/d/17z5z5D2lLt4GcJBUQZ1-9KBn_eV5Q640/view?usp=sharing)

## Credits

App logo ASCII image generated using [http://patorjk.com/software/taag/](http://patorjk.com/software/taag/)

## License

MIT license. See doc in repo.
