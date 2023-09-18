const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const cfonts = require('cfonts');
const dotenv = require('dotenv');


dotenv.config();


//cfonts 
const text = 'Employee Database';

const options = {
  font: 'block', 
  align: 'left',  
  colors: ['cyan', 'yellow'],  
  background: 'black',  
  letterSpacing: 1,  
  lineHeight: 1,   
  space: false,     
  maxLength: '0',   
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


connection.connect((err) =>{
    if (err) throw err;
    console.log("Database Connected!");

    start();
});

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
    const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        
        start();
    });
}