INSERT INTO department (name)
VALUES ("Research"), ("Engineering"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000, 2), ("Engineer", 80000, 2), ("Accountant", 65000, 3), ("Researcher", 65000, 1), ("Support", 39000, 2), ("Support Lead", 75000, 2);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Verity", "Price", 2), ("Alice", "Healy", 1), ("Sarah", "Zellaby", 3), ("Dominic", "DeLuca", 2), ("Alex", "Preston", 4),
("Deanna", "Rodriguez", 5), ("Arthur", "Harrington", 4), ("Sam", "Taylor", 5), ("Sophie", "Vargas-Jackson", 6);

UPDATE employees
SET manager_id = 2
WHERE role_id = 2;

UPDATE employees
SET manager_id = 9
WHERE role_id = 5;