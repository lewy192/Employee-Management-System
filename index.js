const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "departments",
});

connection.connect((err) => {
    if (err) throw err;
});

mainMenu = () => {
    // TODO : check if departement and roles are empty
    // if so push the user to enter atleast 1 department and role

    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "View All Departments",
                "VIew All Roles",
                "Edit employees",
                "Edit roles",
                "Edit departments",

                "exit",
            ],
        })
        .then((choice) => {
            switch (choice.action) {
                case "Edit employees":
                    editEmployeeMenu();
                    break;
                case "Edit roles":
                    editRoles();
                    break;
                case "Edit departments":
                    editDepartments();
                    break;
                case "exit":
                    connection.end();
                    break;
                default:
                    mainMenu();
            }
        });
};

editEmployeeMenu = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add employee",
                "Remove employee",
                "Update employee",
                "Main Menu",
                "exit",
            ],
        })
        .then((choice) => {
            switch (choice.action) {
                case "Add employee":
                    addEmployee();
                    break;
                case "Remove employee":
                    removeEmployee();
                    break;
                case "Update employee":
                    updateEmployee();
                    break;
                case "Main Menu":
                    mainMenu();
                    break;
                case "exit":
                    connection.end();
                    return;
            }
        });
};

addEmployee = () => {
    inquirer
        .prompt([
            {
                name: "firstName",
                message: "Please enter the employees first name:",
                type: "input",
            },
            {
                name: "lastName",
                message: "Please enter the employees last name:",
                type: "input",
            },
            {
                name: "roleId",
                message: "Please enter the employees roleID:",
                type: "input",
            },
            {
                name: "managerId",
                message: "Please enter the employees Manager Id:",
                type: "input",
            },
        ])
        .then((answers) => {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: answers.roleId,
                    manager_id: answers.managerId,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log("Employee Successfully added");
                    console.table(res.affectedRows);
                }
            );
        });
};

editDepartments = () => {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Add Department",
            "Remove Department",
            "Update Department",
            "Main Menu",
            "exit",
        ],
    });
};
editRoles = () => {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Add Role",
            "Remove Role",
            "Update Role",
            "Main Menu",
            "exit",
        ],
    });
};

mainMenu();
