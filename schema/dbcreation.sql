DROP DATABASE if EXISTS department;
CREATE DATABASE department;

USE departments;

-- department and role table must be defined in this order as other tables reference their primary keys as foregin keys and you cant reference something that is not there. 
CREATE TABLE department(
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30),
);

CREATE TABLE role(
    id int primary KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary decimal(10,2),
    department_id int,
    FOREIGN KEY (department_id)REFERENCES deparment(id)
);



CREATE TABLE employee ( 
    id INT PRIMARY Key AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id int ,
    FOREIGN KEY(role_id) REFERENCES role(id),
    manager_id int,
    FOREIGN key(manager_id) REFERENCES employee(id)
);



