const mysql = require('mysql')
const inquirer = require('inquirer')
const figlet = require('figlet')
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'I<3Bats',
  database: 'employeeDB'
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
      console.log(answer)
      switch (answer.mainMenu) {
        case 'View All Employees':
          connection.query(
            'SELECT employees.id, employees.first_name AS "First Name", employees.last_name AS "Last Name", role.title, role.salary, department.name AS "Department" FROM employees JOIN role ON role.id = employees.role_id JOIN department ON department.id = role.department_id;',
            (err, res) => {
              if (err) throw err
              console.table(res)
            }
          )
          mainMenu();
          break
        case 'View Employees by Department':
          connection.query(
            'SELECT department.name AS "Department", employees.first_name AS "First Name", employees.last_name AS "Last Name", role.title, role.salary FROM department JOIN role ON department.id = role.department_id JOIN employees ON role.id = employees.role_id;',
            (err, res) => {
              if (err) throw err
              console.table(res)
            }
          )
          break
        case 'View Employees by Manager':
          connection.query(
            'SELECT employees.first_name as "First Name", employees.last_name as "Last Name", manager.first_name as "Manager", manager.last_name as "Name" from employees manager INNER join employees on employees.manager_id = manager.id;',
            (err, res) => {
              if (err) throw err
              console.table(res)
            }
          )
          break
        case 'View All Roles':
          connection.query(
            'SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON department.id = role.department_id;',
            (err, res) => {
              if (err) throw err
              console.table(res)
            }
          )
          break
        case 'View All Departments':
          connection.query(
            'SELECT name AS "Department" FROM department;',
            (err, res) => {
              if (err) throw err
              console.table(res)
            }
          )
          break
        case 'Update Employee Role':
          break
        case 'Update Employee Manager':
          break
        case 'Add Employee':
          addEmployee()
          break
        case 'Add Department':
          addDept()
          break
        case 'Add Role':
          addRole()
          break
        case 'Quit':
          console.log('Goodbye')
          connection.end()
          break
        default:
          console.log('broken')
          break
      }
    })
    .catch(error => {
      if (error) {
        console.log(error)
      }
    })
}

const addEmployee = () => {
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
          choices: [
            'Manager',
            'Engineer',
            'Accountant',
            'Researcher',
            'Support',
            'Support Lead'
          ],
          name: 'role'
        }
      )
      .then(answer => {
        let roleNum;
        let manager;

        if (answer.role === 'Manager') {
          roleNum = 1
        } else if (answer.role === 'Engineer') {
          roleNum = 2
          manager = 2
        } else if (answer.role === 'Accountant') {
          roleNum = 3
        } else if (answer.role === 'Researcher') {
          roleNum = 4
        } else if (answer.role === 'Support') {
          roleNum = 5
          manager = 9
        } else {
          roleNum = 6
        }
        connection.query('INSERT INTO employees SET ?', {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roleNum,
          manager_id: manager
        })
        mainMenu()
      })
      .catch(error => {
        if (error) {
          console.log(error)
        }
      })
  }

const addRole = () => {
  inquirer
    .prompt(
      {
        type: 'input',
        message: 'Please enter a job title for new role:',
        name: 'jobTitle'
      },
      {
        type: 'number',
        message: 'Please enter a salary for new role:',
        name: 'salary'
      },
      {
        type: 'list',
        message: 'Please select a department for the new role:',
        choices: ['Research',
                  'Engineering',
                  'Finance'],
        name: 'department'
      }
    )
    .then(answer => {
      let deptNum;

      if (answer.department === 'Research') {
        deptNum = 1
      } else if (answer.department === 'Engineering') {
        deptNum = 2
      } else {
        deptNum = 3
      }
      connection.query('INSERT INTO role SET ?', {
        title: answer.jobTitle,
        salary: answer.salary,
        department_id: deptNum
      })
      mainMenu()
    })
    .catch(error => {
      if (error) {
        console.log(error)
      }
    })
}

const addDept = () => {
  inquirer
    .prompt({
      type: 'input',
      message: 'Please enter the new department name:',
      name: 'deptName'
    })
    .then(answer => {
      connection.query('INSERT INTO department SET ?', {
        name: answer.deptName
      })
      mainMenu()
    })
    .catch(error => {
      if (error) {
        console.log(error)
      }
    })
}

// const updateRole = () => {
//   connection.query('SELECT * FROM employees', (err, results) => {
//     if (err) throw err
//     inquirer
//       .prompt(
//         {
//           type: 'list',
//           message: "Please select an employee to update:",
//           choices () {
//             const choiceArray = []
//             results.forEach(({ item_name }) => {
//               choiceArray.push(item_name)
//             })
//             return choiceArray
//           },
//           name: 'department'
//         }
//       )
//       .then(answer => {
//         if (answer.department === 'Research') {
//           let deptNum = 1
//         } else if (answer.role === 'Engineering') {
//           deptNum = 2
//         } else {
//           deptNum = 3
//         }
//         connection.query('INSERT INTO role SET ?', {
//           title: answer.jobTitle,
//           salary: answer.salary,
//           department_id: deptNum
//         })
//         mainMenu()
//       })
//       .catch(error => {
//         if (error) {
//           console.log(error)
//         }
//       })
//   })
// }

start()
