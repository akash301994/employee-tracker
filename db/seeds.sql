INSERT TO departments (department_name)
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
('Creative Services'),

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
('Kate', 'Conover', 1, 1),
('Lucas', 'Evans', 2, 2),
('Rosalia', 'May', 3, 3),
('Alessandro', 'Cordova', 4, 4),
('Miley', 'Long', 5, 5),
('Derrick', 'Abeert', 6, 6),
('London', 'England', 7, 7),
('Alfonzo', 'Dunagan', 8, 8),
('Sara', 'Torres', 9, 9),
('Ayan', 'Mosley', 10, 10),

