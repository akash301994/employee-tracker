const mysql = require('mysql2');
const inquirer = require('inquirer');

require("dotenv").config();

const db = mysql.createConnection(
    {
      host: 'localhost',
      // host: '127.0.0.1'
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Jasmine1994!',
      database: 'employee_trackerDb'
    },
    console.log(`Connected to the  database.`)
  );

  