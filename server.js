const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
const cfonts = require('cfonts');




const connection = mysql2.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: "employeeTracker_db",
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
  
  