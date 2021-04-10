const mysql = require('mysql')
const inquirer = require('inquirer')
const figlet = require('figlet')
const cTable = require('console.table')

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
    .prompt([
      {
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
      }
    ])
    .then(answer => {
      switch (answer.mainMenu) {
        case 'View All Employees':
          viewAllEmployees()
          break
        case 'View Employees by Department':
          viewEmpByDept()
          break
        case 'View Employees by Manager':
          viewByManager()
          break
        case 'View All Roles':
          viewRoles()
          break
        case 'View All Departments':
          viewDepts()
          break
        case 'Update Employee Role':
          updateRole()
          break
        case 'Update Employee Manager':
          updateManager()
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

const viewAllEmployees = () => {
  connection.query(
    'SELECT employees.id, employees.first_name AS "First Name", employees.last_name AS "Last Name", role.title, role.salary, department.name AS "Department" FROM employees JOIN role ON role.id = employees.role_id JOIN department ON department.id = role.department_id;',
    (err, res) => {
      if (err) throw err
      console.table(res)
    }
  )
  mainMenu()
}

const viewEmpByDept = () => {
  connection.query(
    'SELECT department.name AS "Department", employees.first_name AS "First Name", employees.last_name AS "Last Name", role.title, role.salary FROM department JOIN role ON department.id = role.department_id JOIN employees ON role.id = employees.role_id;',
    (err, res) => {
      if (err) throw err
      console.table(res)
    }
  )
  mainMenu()
}

const viewByManager = () => {
  connection.query(
    'SELECT employees.first_name as "First Name", employees.last_name as "Last Name", manager.first_name as "Manager", manager.last_name as "Name" from employees manager INNER join employees on employees.manager_id = manager.id;',
    (err, res) => {
      if (err) throw err
      console.table(res)
    }
  )
  mainMenu()
}

const viewRoles = () => {
  connection.query(
    'SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON department.id = role.department_id;',
    (err, res) => {
      if (err) throw err
      console.table(res)
    }
  )
  mainMenu()
}

const viewDepts = () => {
  connection.query(
    'SELECT name AS "Department" FROM department;',
    (err, res) => {
      if (err) throw err
      console.table(res)
    }
  )
  mainMenu()
}

const addEmployee = () => {
  inquirer
    .prompt([
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
    ])
    .then(answer => {
      let roleNum
      let manager

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
      console.log(
        `${answer.firstName} ${answer.lastName} successfully added as a(n) ${answer.role}`
      )
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
    .prompt([
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
        choices: ['Research', 'Engineering', 'Finance'],
        name: 'department'
      }
    ])
    .then(answer => {
      let deptNum

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
      console.log(`${answer.jobTitle} successfully added to ${answer.department}.`)
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
    .prompt([
      {
        type: 'input',
        message: 'Please enter the new department name:',
        name: 'deptName'
      }
    ])
    .then(answer => {
      connection.query('INSERT INTO department SET ?', {
        name: answer.deptName
      })
      console.log(`${answer.deptName} successfully added.`)
      mainMenu()
    })
    .catch(error => {
      if (error) {
        console.log(error)
      }
    })
}

const updateRole = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Please select the employee whose role you wish to update:',
        choices: [
          'Verity Price',
          'Alice Healy',
          'Sarah Zellaby',
          'Dominic DeLuca',
          'Alex Preston',
          'Deanna Rodriguez',
          'Arthur Harrington',
          'Sam Taylor',
          'Sophie Vargas-Jackson'
        ],
        name: 'roleEmp'
      },
      {
        type: 'list',
        message: "Please select the employee's new role:",
        choices: [
          'Manager',
          'Engineer',
          'Accountant',
          'Researcher',
          'Support',
          'Support Lead'
        ],
        name: 'newRole'
      }
    ])
    .then(answer => {
      let empId;
      let roleChange;
      let newMan;

      switch(answer.roleEmp)
      { case 'Verity Price':
          empId = 1;
          break;
        case 'Alice Healy':
          empId = 2;
          break;
        case 'Sarah Zellaby':
          empId = 3;
          break;
        case 'Domninic DeLuca':
          empId = 4
          break;
        case 'Alex Preston':
          empId = 5
          break;
        case 'Deanna Rodriguez':
          empId = 6
          break;
        case 'Arthur Harrington':
          empId = 7
          break;
        case 'Sam Taylor':
          empId = 8
          break;
        case 'Sophie Vargas-Jackson':
          empId = 9
          break;
        default:
          break;
      }

      switch(answer.newRole)
      {
        case 'Manager':
          roleChange = 1
          break;
        case 'Engineer':
          roleChange = 2
          newMan = 2
          break;
        case 'Accountant':
          roleChange = 3
          break;
        case 'Researcher':
          roleChange = 4
          break;
        case 'Support':
          roleChange = 5
          newMan = 9
        case 'Support Lead':
          roleChange = 6
          break;
        default:
          break;    
      }

      connection.query(`UPDATE employees SET ? WHERE id = ${empId} `, {
        role_id: roleChange,
        manager_id: newMan
      })
      mainMenu()
    })
    .catch(error => {
      if (error) {
        console.log(error)
      }
    })
}

const updateManager = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Please select the employee whose manager you wish to update:',
        choices: [
          'Verity Price',
          'Dominic DeLuca',
          'Alex Preston',
          'Deanna Rodriguez',
          'Arthur Harrington',
          'Sam Taylor'
        ],
        name: 'manEmp'
      },
      {
        type: 'list',
        message: "Please select the employee's new manager:",
        choices: [
          'Alice Healy',
          'Sarah Zellaby',
          'Sophie Vargas-Jackson'
        ],
        name: 'newManager'
      }
    ])
    .then(answer => {
      let eId;
      let mId;

      switch(answer.roleEmp)
      { case 'Verity Price':
          eId = 1;
          break;
        case 'Domninic DeLuca':
          eId = 4
          break;
        case 'Alex Preston':
          eId = 5
          break;
        case 'Deanna Rodriguez':
          eId = 6
          break;
        case 'Arthur Harrington':
          eId = 7
          break;
        case 'Sam Taylor':
          eId = 8
          break;
        default:
          break;
      }

      switch(answer.newRole)
      {
        case 'Alice Healy':
          mId = 2
          break;
        case 'Sarah Zellaby':
          mId = 3
          break;
        case 'Sopie Vargas-Jackson':
          mId = 9
          break;
        default:
          break;    
      }

      connection.query(`UPDATE employees SET ? WHERE id = ${eId} `, {
        manager_id: mId
      })
      mainMenu()
    })
    .catch(error => {
      if (error) {
        console.log(error)
      }
    })
}

start()