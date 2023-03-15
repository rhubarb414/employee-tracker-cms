INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Design'),
    ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Manager (Eng)', 200000, 1),
    ('Manager (Design)', 200000, 2),
    ('Manager (Finance)', 200000, 3),
    ('Lead Engineer', 150000, 1),
    ('Lead Designer', 150000, 2),
    ('Lead Accountant', 150000, 3),
    ('Engineer', 120000, 1),
    ('Designer', 120000, 2),
    ('Accountant', 120000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Christopher', 'DuBois', 1, null),
    ('Tim', 'Wellens', 2, null),
    ('Mariah', 'Mirens', 3, null),
    ('Stef', 'Angeles', 4, 1),
    ('Kurt', 'Schweitzer', 5, 2),
    ('Biggs', 'Appleton', 6, 3),
    ('Jennifer', 'Beardsley', 7, 1),
    ('Allison', 'Kranshaw', 8, 2),
    ('Vincent', 'Togayashi', 9, 3),
    ('Elizabeth', 'Fairleigh', 7, 1);



