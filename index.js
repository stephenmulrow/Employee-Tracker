// imports
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');



// array with current departments, roles and employees.
const deptAry = ["Sales", "Marketing", "IT", "Legal"];

const roleAry = ["Sales Rep", "Sales Lead", "Sales Manager", "Marketing Specialest", "Product Marketing", "Marketing Manager", "Help Desk", "Developer", "IT Manager", "Paralegal", "Lawyer", "Legal Manager"];

const empAry = ["John", "Tom", "Sam", "Jeff", "Damon", "Ashley", "Josiah", "Mychaela", "Kunal", "Tyanna", "Steven", "Sarah"];

// Questions arrays that the user can navigate to and answer.  
const nextStep = [
    {
      type: 'list',
      message: "What would you like to do?",
      choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
      name: 'nextStep',
   },
]; 


const department = [
    {
      message: 'What is the name of the department?',
      name: 'department',
   },
]; 

const role = [
    {
      message: 'What is the name of the role?',
      name: 'roleName',
    },
    {
        message: 'What is the salary of the role?',
        name: 'roleSalary',
    },
    {
        type: 'list',
        message: "What department does the role belong to?",
        choices: deptAry,
        name: 'roleDepartment',
     },
    
]; 

const addEmp = [
    {
      message: 'What is the employees first name?',
      name: 'empFirstName',
    },
    {
      message: 'What is the employees last name?',
      name: 'empLastName',
    },
    {
      type: 'list',
      message: "What is the employees role?",
      choices: roleAry,
      name: 'empRole',
     },
    //  {
    //   type: 'list',
    //   message: "What is the employees manager?",
    //   choices: [],
    //   name: 'empManager',
    //  },
]; 

const updateEmpRole = [
    {
      type: 'list',
      message: "Which employee do you want to update?",
      choices: empAry,
      name: 'empUpdate',
    },
    {
      type: 'list',
      message: "Which role do you want to assign the selected employee?",
      choices: roleAry,
      name: 'empUpdateRole',
    },
];

//creating connection to database.  
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Wonderwall44!',
      database: 'company_db'
    },
  );

// function that identifies what to do next after user selection. 
  function routeQuestions() {
    inquirer.prompt(nextStep)
    .then((data) => {
        if (data.nextStep === "View All Employees") {
            db.query('SELECT employee.id, employee.first_name, employee.last_name, emp_role.title, department.dept_name, emp_role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN emp_role ON employee.role_id = emp_role.id JOIN department ON emp_role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;', function (err, results) {
                console.table(results);
                routeQuestions();
              });
        } else if (data.nextStep === "Add Employee") {
            addEmployee()

        } else if (data.nextStep === "Update Employee Role") {
            updateEmployeeRole()
           
        } else if (data.nextStep === "View All Roles") {
            db.query('SELECT emp_role.id, emp_role.title, emp_role.salary, department.dept_name FROM emp_role JOIN department ON emp_role.department_id = department.id', function (err, results) {
                console.log(err)
                console.table(results);
                routeQuestions();
              });
        } else if (data.nextStep === "Add Role") {
            addRole()
            
        } else if (data.nextStep === "View All Departments") {
            db.query('SELECT * FROM department', function (err, results) {
                console.table(results);
                routeQuestions();
              });
        } else if (data.nextStep === "Add Department") {
            addDepartment();

        } else if (data.nextStep === "Quit") {
            console.log("Thank you, come again!");
        }
    })
};


// retrieves new department name, adds to department array and adds it to the database. 
function addDepartment() {
    inquirer.prompt(department)
    .then((data) => {
        
        const newDepartment = JSON.stringify(data.department).split('"').join('');
        deptAry.push(newDepartment)
     
   
        db.query('INSERT INTO department (dept_name) VALUES (?)', newDepartment, function (err, results) {
            console.log("***Added " + newDepartment + " to the database***");
            routeQuestions();
          });
    })
};


//retrieves the new roles name, salary and department. Adds it to the role array and updates the database. 
function addRole() {
    inquirer.prompt(role)
    .then((data) => {
        
        const roleName = JSON.stringify(data.roleName).split('"').join('');
        roleAry.push(roleName);

        const roleSalary = JSON.stringify(data.roleSalary).split('"').join('');
        
        const roleDepartment = JSON.stringify(data.roleDepartment).split('"').join('');


        db.query('SELECT department.id FROM department WHERE dept_name = (?)', roleDepartment, function (err, res) {
            const deptId = (res.map(a => `${a.id}`).join(', '));

            department(deptId);
          });

            function department(id) {
                const deptId = id;

                console.log(deptId)

                db.query('INSERT INTO emp_role (title, salary, department_id) VALUES (?, ?, ?)', [roleName, roleSalary, deptId], function (err, results) {
                    console.log("Added " + roleName + " with the salary of " + roleSalary);
                
                    routeQuestions();
                  });

            }
    })
}; 


//creates new employee. Retrieves their first name, last name and role title. Updates the employee array and database. 
function addEmployee() {
    inquirer.prompt(addEmp)
    .then((data) => {
     
        const newEmpFirst = JSON.stringify(data.empFirstName).split('"').join('');
        const newEmpLast = JSON.stringify(data.empLastName).split('"').join('');
        const newEmpRole = JSON.stringify(data.empRole).split('"').join('');

        empAry.push(newEmpFirst)

        db.query('SELECT emp_role.id FROM emp_role WHERE title = (?)', newEmpRole, function (err, res) {
            const roleId = (res.map(a => `${a.id}`).join(', '));

            insert(roleId);
          });

          function insert (idData) {
            const roleId = idData;

            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [newEmpFirst, newEmpLast, roleId, 1], function (err, results) {
            
            console.log("Added " + newEmpFirst + " " + newEmpLast + " to the role of " + newEmpRole );
            
            routeQuestions();
              });

          }
    })
};

// updates current employees role/department. updates database. 
function updateEmployeeRole() {
    inquirer.prompt(updateEmpRole)
    .then((data) => {
        
        const empUpdate = JSON.stringify(data.empUpdate).split('"').join('');
        const empUpdateRole = JSON.stringify(data.empUpdateRole).split('"').join('');

        db.query('SELECT emp_role.id FROM emp_role WHERE title = (?)', empUpdateRole, function (err, res) {
            const roleId = (res.map(a => `${a.id}`).join(', '));

            test(roleId);
          });
         
          function test (idk) {
            const roleId = idk;
            db.query('UPDATE employee SET role_id = (?) WHERE first_name = (?)', [roleId, empUpdate], function (err, results) {

                console.log(`${empUpdate} has a new role of ${empUpdateRole}`)

                routeQuestions();
              });
          }
    })
}


//starts the questions. 
  routeQuestions();