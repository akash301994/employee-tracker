const mysql2 = require("mysql2");
const inquirer = require("inquirer");
const cfonts = require("cfonts");
const dotenv = require("dotenv");

dotenv.config();

//cfonts
const text = "Employee Database";

const options = {
  font: "block",
  align: "left",
  colors: ["cyan", "yellow"],
  background: "black",
  letterSpacing: 1,
  lineHeight: 1,
  space: false,
  maxLength: "0",
};

cfonts.say(text, options);

//Database connection
const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Database Connected!");

  start();
});

//start
function start() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Add a Manager",
        "Update an employee role",
        "View Employees by Manager",
        "View Employees by Department",
        "Delete Departments | Roles | Employees",
        "View the total utilized budget of a department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a Manager":
          addManager();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "View Employees by Manager":
          viewEmployeesByManager();
          break;
        case "View Employees by Department":
          viewEmployeesByDepartment();
          break;
        case "Delete Departments | Roles | Employees":
          deleteDepartmentsRolesEmployees();
          break;
        case "View the total utilized budget of a department":
          viewTotalUtilizedBudgetOfDepartment();
          break;
        case "Exit":
          exitApplication();
          break;
      }
    });
}

//view depapartments
function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);

    start();
  });
}

//view all roles
function viewAllRoles() {
  const query =
    "SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);

    start();
  });
}

//view all employees
function viewAllEmployees() {
  const query = `
  SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
  FROM employee e
  LEFT JOIN roles r ON e.role_id = r.id
  LEFT JOIN departments d ON r.department_id = d.id
  LEFT JOIN employee m ON e.manager_id = m.id;
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);

    start();
  });
}

// function to add a department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Enter the name of the new department:",
    })
    .then((answer) => {
      console.log(answer.name);
      const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(`Added department ${answer.name} to the database!`);

        start();
        console.log(answer.name);
      });
    });
}

//add role
function addRole() {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the new role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary of the new role:",
        },
        {
          type: "list",
          name: "department",
          message: "Select the department for the new role:",
          choices: res.map((department) => department.department_name),
        },
      ])
      .then((answers) => {
        const department = res.find(
          (department) => department.name === answers.department
        );
        const query = "INSERT INTO roles SET ?";
        connection.query(
          query,
          {
            title: answers.title,
            salary: answers.salary,
            department_id: department,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
            );

            start();
          }
        );
      });
  });
}



// Function to add an employee
function addEmployee() {
  //retrieving the list of roles and managers for the inquirer prompts.
  const roleQuery = `
    SELECT id, title FROM roles
  `;

  const managerQuery = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employee
  `;

  connection.query(roleQuery, (err, roles) => {
    if (err) throw err;

    connection.query(managerQuery, (err, managers) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Enter the first name of the employee:",
          },
          {
            type: "input",
            name: "last_name",
            message: "Enter the last name of the employee:",
          },
          {
            type: "list",
            name: "role_id",
            message: "Select the role for the employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            type: "list",
            name: "manager_id",
            message: "Select the manager for the employee:",
            choices: [
              { name: "None", value: null },
              ...managers.map((manager) => ({
                name: manager.manager_name,
                value: manager.id,
              })),
            ],
          },
        ])
        .then((answer) => {
          const query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)
          `;

          connection.query(
            query,
            [
              answer.first_name,
              answer.last_name,
              answer.role_id,
              answer.manager_id,
            ],
            (err) => {
              if (err) throw err;
              console.log("Employee added successfully.");
              start();
            }
          );
        });
    });
  });
}

// Function to add a manager
function addManager() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the manager:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the manager:',
      },
    ])
    .then((answer) => {
      const query = `
        INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?)
      `;

      connection.query(
        query,
        [answer.first_name, answer.last_name, null, null],
        (err) => {
          if (err) throw err;
          console.log('Manager added successfully.');
          start();
        }
      );
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
  // First, we need to retrieve the list of employees and roles for the inquirer prompts.
  const employeeQuery = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employee
  `;

  const roleQuery = `
    SELECT id, title FROM roles
  `;

  connection.query(employeeQuery, (err, employees) => {
    if (err) throw err;

    connection.query(roleQuery, (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employees.map((employee) => ({
              name: employee.employee_name,
              value: employee.id,
            })),
          },
          {
            type: 'list',
            name: 'new_role_id',
            message: 'Select the new role for the employee:',
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answer) => {
          const query = `
            UPDATE employee
            SET role_id = ?
            WHERE id = ?
          `;

          connection.query(
            query,
            [answer.new_role_id, answer.employee_id],
            (err) => {
              if (err) throw err;
              console.log('Employee role updated successfully.');
              start();
            }
          );
        });
    });
  });
}

// Function to view employees by manager
function viewEmployeesByManager() {
  // First, we need to retrieve the list of managers for the inquirer prompt.
  const managerQuery = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name
    FROM employee
    WHERE manager_id IS NULL
  `;

  connection.query(managerQuery, (err, managers) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'manager_id',
          message: 'Select the manager to view employees:',
          choices: managers.map((manager) => ({
            name: manager.manager_name,
            value: manager.id,
          })),
        },
      ])
      .then((answer) => {
        const query = `
          SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name
          FROM employee
          WHERE manager_id = ?
        `;

        connection.query(query, [answer.manager_id], (err, employees) => {
          if (err) throw err;
          // Display employees managed by the selected manager
          console.log(`Employees managed by ${managers.find((m) => m.id === answer.manager_id).manager_name}:`);
          console.table(employees);
          start();
        });
      });
  });
}

// Function to view employees by department
function viewEmployeesByDepartment() {
  // First, we need to retrieve the list of departments for the inquirer prompt.
  const departmentQuery = `
    SELECT id, department_name FROM departments
  `;

  connection.query(departmentQuery, (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'department_id',
          message: 'Select the department to view employees:',
          choices: departments.map((department) => ({
            name: department.department_name,
            value: department.id,
          })),
        },
      ])
      .then((answer) => {
        const query = `
          SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, r.title AS role
          FROM employee e
          INNER JOIN roles r ON e.role_id = r.id
          WHERE r.department_id = ?
        `;

        connection.query(query, [answer.department_id], (err, employees) => {
          if (err) throw err;
          // Display employees in the selected department
          console.log(`Employees in the ${departments.find((d) => d.id === answer.department_id).department_name} department:`);
          console.table(employees);
          start();
        });
      });
  });
}

function deleteDepartmentsRolesEmployees() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Select what you want to delete:',
        choices: ['Delete a department', 'Delete a role', 'Delete an employee', 'Back'],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case 'Delete a department':
          deleteDepartment();
          break;
        case 'Delete a role':
          deleteRole();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'Back':
          start();
          break;
      }
    });
}

// Function to delete a department
function deleteDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department_id',
        message: 'Enter the ID of the department to delete:',
      },
    ])
    .then((answer) => {
      const query = `
        DELETE FROM departments
        WHERE id = ?
      `;

      connection.query(query, [answer.department_id], (err, result) => {
        if (err) throw err;
        console.log('Department deleted successfully.');
        start();
      });
    });
  
}

// Function to delete a role
function deleteRole() {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'role_id',
      message: 'Enter the ID of the role to delete:',
    },
  ])
  .then((answer) => {
    const query = `
      DELETE FROM roles
      WHERE id = ?
    `;

    connection.query(query, [answer.role_id], (err, result) => {
      if (err) throw err;
      console.log('Role deleted successfully.');
      start();
    });
  });
}

// Function to delete an employee
function deleteEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employee_id',
        message: 'Enter the ID of the employee to delete:',
      },
    ])
    .then((answer) => {
      const query = `
        DELETE FROM employee
        WHERE id = ?
      `;

      connection.query(query, [answer.employee_id], (err, result) => {
        if (err) throw err;
        console.log('Employee deleted successfully.');
        start();
      });
    });
}




// Function to view the total utilized budget of a department
function viewTotalUtilizedBudgetOfDepartment() {
  
  const departmentQuery = `
    SELECT id, department_name FROM departments
  `;

  connection.query(departmentQuery, (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'department_id',
          message: 'Select the department to view the budget:',
          choices: departments.map((department) => ({
            name: department.department_name,
            value: department.id,
          })),
        },
      ])
      .then((answer) => {
        const query = `
          SELECT SUM(r.salary) AS total_budget
          FROM roles r
          WHERE r.department_id = ?
        `;

        connection.query(query, [answer.department_id], (err, result) => {
          if (err) throw err;
          // Display the total budget of the selected department
          console.log(`Total Utilized Budget for ${departments.find((d) => d.id === answer.department_id).department_name}: $${result[0].total_budget}`);
          start();
        });
      });
  });
}

function exitApplication() {
  console.log('Exiting the application.');
  connection.end(); 
  process.exit(0); 
}