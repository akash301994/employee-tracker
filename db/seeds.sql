USE employeeTracker_db;

INSERT INTO departments (department_name)
VALUES
('Asset Management'),
('Business Development'),
('Engineering'),
('Corporate Communications'),
('Human Resources'),
('Sales'),
('Production'),
('Risk Management'),
('Operations'),
('Creative Services');

INSERT INTO ROLES (title, salary, department_id)
VALUES
('Asset Manager', 60000.00, 1),
('Business Management Lead', 140000.00, 2),
('Lead Engineer', 170000.00, 3),
('Head of Communications', 85000.00, 4),
('Manager of Human Resources', 70000.00, 5),
('Sales Manager', 130000.00, 6),
('Production Lead', 95000.00, 7),
('Risk Management Supervisor', 100000.00, 8),
('Operations Manager', 66000.00, 9),
('Creative Services Lead', 70000.00, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Kate', 'Conover', 1, null),
('Lucas', 'Evans', 2, 1),
('Rosalia', 'May', 3, 2),
('Alessandro', 'Cordova', 4, 3),
('Miley', 'Long', 5, 4),
('Derrick', 'Abeert', 6, 5),
('London', 'England', 7, 6),
('Alfonzo', 'Dunagan', 8, 7),
('Sara', 'Torres', 9, 8),
('Ayan', 'Mosley', 10, 9);

