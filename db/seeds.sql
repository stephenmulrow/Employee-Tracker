

-- current departments
INSERT INTO department (dept_name)
VALUES ("Sales"),
       ("Marketing"),
       ("IT"),
       ("Legal");

-- current roles, salary and the department they are linked to.
INSERT INTO emp_role (title, salary, department_id)
VALUES ("Sales Rep", 70000, 1),
       ("Sales Lead", 80000, 1),
       ("Sales Manager", 100000, 1),
       ("Marketing Specialest", 65000, 2), 
       ("Product Marketing", 70000, 2), 
       ("Marketing Manager", 100000, 2),
       ("IT Desk Help", 55000, 3),
       ("Developer", 85000, 3), 
       ("IT Manager", 100000, 3),
       ("Paralegal", 80000, 4), 
       ("Lawyer", 125000, 4),
       ("Legal Manager", 200000, 4);

-- current employees first name, last name, role and manager. 
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Dorn", 3, null),
       ("Troy", "Smith", 1, 1),
       ("Dam", "Sun", 2, 1), 
       ("Hector", "Mill", 6, null), 
       ("Mike", "Baker", 5, 4),
       ("Timmy", "Turner", 4, 4),
       ("Kim", "Rosen", 9, null), 
       ("Patrick", "Miller", 8, 7),
       ("Mary", "Lucas", 7, 7), 
       ("Reggie", "Butler", 12, null), 
       ("Chandler", "Jones", 11, 9),
       ("Larry", "Williams", 10, 9);