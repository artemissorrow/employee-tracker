const mysql = require('mysql');
const inquirer = require('inquirer');
const figlet = require('figlet');

const connection = mysql.createConnection({
  host: 'localhost',

  port: 3306,

  user: 'root',
  password: 'I<3Bats',

  database: 'employeeDB',

  start();
})

const start = () => {
  console.log(figlet.textSync('employee'))
  console.log(figlet.textSync('manager'))
  mainMenu()
}

const mainMenu = () => {
  inquirer
    .prompt({
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View Employees by Department',
        'View Employees by Manager',
        'View All Roles',
        'View All Departments',
        new inquirer.Separator(),
        'Update Employee Role',
        'Update Employee Manager',
        new inquirer.Separator(),
        'Add Employee',
        'Add Department',
        'Add Role',
        new inquirer.Separator(),
        'Quit'
      ],
      name: 'mainMenu'
    })
    .then(answer => {
      
     })
}

const addEmployee = () => {
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    inquirer
      .prompt(
        {
          type: 'input',
          message: "Please enter new employee's first name:",
          name: 'firstName'
        },
        {
          type: 'input',
          message: "Please enter new employee's last name:",
          name: 'lastName'
        },
        {
          type: 'list',
          message: "Please select new employee's role:",
          choices() {
            const choiceArray = [];
            results.forEach(({ item_name }) => {
              choiceArray.push(item_name);
            });
            return choiceArray;
          },
          name: 'role'
        })
      .then(answer => {
        if (answer.role === 'Manager') {
          let roleNum = 1;
        } else if (answer.role === 'Engineer') {
          roleNum = 2;
          let manager = 2;
        } else if (answer.role === 'Accountant') {
          roleNum = 3;
        } else if (answer.role === 'Researcher') {
          roleNum = 4;
        } else if (answer.role === 'Support') {
          roleNum = 5;
          manager = 9;
        } else {
          roleNum = 6;
        }
        connection.query(
          'INSERT INTO employees SET ?',
          // QUESTION: What does the || 0 do?
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: roleNum,
            manager_id: manager || 0
          },
        );
        mainMenu();
      });
  })
};
