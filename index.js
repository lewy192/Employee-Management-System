const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lewyiscool92",
    database: "department",
});

connection.connect((err) => {
    if (err) throw err;
});

mainMenu = () => {
    // TODO : check if departement and roles are empty
    // if so push the user to enter atleast 1 department and role
    // connection.qusery(`SELECT * from users `,)

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
                "View All Roles",
                "Edit employees",
                "Edit roles",
                "Edit departments",
                "exit",
            ],
        })
        .then((choice) => {
            switch (choice.action) {
                case "View All Employees":
                    connection.query(`select * from employee
                from`);
                    break;
                case "View All Departments":
                    viewTable("department");
                    break;
                case "View All Roles":
                    viewTable("role");
                    break;
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
    if (!checkTable("employee")) {
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
    }
    console.log(
        `------\nThere are no departments in your business yet.\n------`
    );
    addEmployee();
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
    viewTable();
    if (!checkTable("department")) {
        inquirer
            .prompt({
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
            })
            .then((choices) => {
                switch (choices.action) {
                    case "Add Department":
                        addDepartment();
                        break;
                    case "Remove Department":
                        removeDepartment();
                        break;
                    case "Update Department":
                        updateDepartment();
                        break;
                    case "Main Menu":
                        mainMenu();
                        break;
                    case "exit":
                        connection.end();
                        return;
                    default:
                        mainMenu();
                        break;
                }
            });
    }
    console.log(
        `------\nThere are no departments in your business yet.\n------`
    );
    addDepartment();
};
removeDepartment = () => {
    inquirer
        .prompt([
            {
                name: departmentName,
                message: "Enter the name of the department you wish to remove:",
                type: "input",
            },
        ])
        .then((answer) => {
            connection.query(
                `DELETE FROM department WHERE name = ${answer.departmentName}`,
                (err, res) => {
                    if (err) console.log(err);
                    console.table(res);
                    console.log("^^^^^^ Has been removed ^^^^^^");
                }
            );
        });
};

addDepartment = () => {
    inquirer
        .prompt([
            {
                name: "departmentName",
                message: "Please enter a department name:",
                type: "input",
            },
        ])
        .then((answers) => {
            connection.query(`INSERT INTO department SET ?`, {
                name: answers.departmentName,
            });
            inquirer
                .prompt([
                    {
                        name: userChoice,
                        message: "where would you like to go from here?",
                        type: "list",
                        choices: ["Main Menu", "Edit departments", "Exit"],
                    },
                ])
                .then((choice) => {
                    switch (choice.userChoice) {
                        case "Main Menu":
                            mainMenu();
                            break;
                        case "Edit departments":
                            editDepartments();
                            break;
                        case "Exit":
                            return;
                        default:
                            mainMenu();
                            break;
                    }
                });
        });
};

editRoles = () => {
    if (!checkTable("role")) {
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
    }
    console.log(`------\nThere are no roles in your business yet.\n------`);
};

viewTable = (tableName) => {
    connection.query(`SELECT * from ${tableName}`, (err, res) => {
        if (err) console.log(err);
        if (res.length > 0) {
            console.table(res);
        } else {
            console.log(
                `------\nThere are no ${tableName}s in your business yet.\n------`
            );
            mainMenu();
        }
    });
};

checckTable = (tableName) => {
    connection.query(`select * from ${tableName}`, (err, res) => {
        if (err) console.log(err);
        if (res.length > 0) return true;
        return false;
    });
};

mainMenu();
