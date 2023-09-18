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


