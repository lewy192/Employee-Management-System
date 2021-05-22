const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "departments",
});

connection.connect(function (err) {
    if (err) {
        return console.error("error: " + err.message);
    }

    console.log("Connected to the MySQL server.");
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
                "Remove Employee",
                "Update Employees Role",
                "Edit departments",
                "exit",
            ],
        })
        .then((choice) => {
            // console.log(choice);
            switch (choice.action) {
                case "View All Employees":
                    connection.query(
                        `select e.*, 
                    role.title, role.salary, role.department_id,
                    d.department_name
                    from employee e 
                    inner join role on e.role_id = role.id
                    inner join department d on d.id = role.department_id;`,
                        (err, res) => {
                            if (err) {
                                console.log(err);
                                mainMenu();
                            }
                            console.table(res);
                            mainMenu();
                        }
                    );
                    break;
                case "View All Employees By Department":
                    connection.query(
                        `select e.*,
                        d.department_name
                        from employee e 
                        inner join role on e.role_id = role.id
                        inner join department d on d.id = role.department_id
                        ORDER BY d.department_name ASC;`,
                        (err, res) => {
                            if (err) {
                                console.log(err);
                                mainMenu();
                            }
                            console.table(res);
                            mainMenu();
                        }
                    );
                    // viewTable("department");
                    break;
                case "View All Employees By Department":
                    // TODO
                    break;
                case "View All Departments":
                    viewTable("department");
                    break;
                case "View All Roles":
                    viewTable("role");
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employees Role":
                    updateEmployeeRole();
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
                message: "Please select the employees role:",
                type: "list",
                choices: [
                    "dynamically built array based on what roles are in the role table",
                ],
            },
            {
                name: "managerId",
                message: "Please enter the employees Manager Id:",
                choices: [
                    "dynamiocally built array based on what managers are in the employee table",
                ],
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

removeEmployee = () => {
    // selectEmployee().then(function (results) {
    //     console.log(`--------- PROMISE RESULTS : \n${results[0]}\n ---------`);
    // });
    // console.log("end");
    connection.query(`select * from employee`, (err, res) => {
        if (err) console.log(err);
        const employeeChoices = res.map((employee) => {
            const obj = {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
            return obj;
        });

        console.log(employeeChoices);
        inquirer
            .prompt({
                type: "list",
                message: "select which employee you wish to remove",
                choices: employeeChoices,
                name: "removeEmployee",
            })
            .then((choice) => {
                connection.query(
                    `DELETE from employee WHERE ?`,
                    { id: choice.removeEmployee },
                    (err, res) => {
                        if (err) console.log(err);
                        console.log("Employee Deleted");
                        mainMenu();
                    }
                );
            });
    });
};
updateEmployeeRole = () => {
    connection.query(`select * from employee`, (err, res) => {
        if (err) console.log(err);
        const employeeChoices = res.map((employee) => {
            const obj = {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
            return obj;
        });
        inquirer
            .prompt({
                name: "employeeRoleChange",
                type: "list",
                choices: employeeChoices,
                message:
                    "Please select the employee who's role you'd like to change:",
            })
            .then((usersEmployeeChoice) => {
                connection.query("select * from role", (err, res) => {
                    if (err) console.log(err);
                    const roleChoices = res.map((role) => {
                        const obj = {
                            name: role.title,
                            value: role.id,
                        };
                        return obj;
                    });
                    inquirer
                        .prompt({
                            type: "list",
                            message: "Please select their new role:",
                            choices: roleChoices,
                            name: "roleChoice",
                        })
                        .then((usersRoleChoice) => {
                            connection.query(
                                `update employee
                            set role_id = ?
                            where id = ?
                            `,
                                [
                                    usersRoleChoice.roleChoice,
                                    usersEmployeeChoice.employeeRoleChange,
                                ],
                                (err, res) => {
                                    if (err) console.log(err);
                                    console.log(res);
                                }
                            );
                        });
                });
            });
    });
};

updateEmployeeManager = () => {
    connection.query(`select * from employee where manager_id`, (err, res) => {
        if (err) console.log(err);
        const employeeChoices = res.map((employee) => {
            const obj = {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
            return obj;
        });
        inquirer
            .prompt({
                name: "employeeManagerChange",
                type: "list",
                choices: employeeChoices,
                message:
                    "Please select the employee who's manager you'd like to change:",
            })
            .then((usersEmployeeChoice) => {
                connection.query(
                    `select * from employee where manager_id is null`,

                    (err, res) => {
                        console.table(res);
                        if (err) console.log(err);
                        const managerChoices = res.map((manager) => {
                            const obj = {
                                name: `${manager.first_name} ${manager.last_name}`,
                                value: manager.id,
                            };
                            return obj;
                        });
                        inquirer
                            .prompt({
                                type: "list",
                                message: "Please select their new manager:",
                                choices: managerChoices,
                                name: "managerChoice",
                            })
                            .then((usersManagerChoice) => {
                                const newManagerId =
                                    usersManagerChoice.managerChoice;
                                const employeesId =
                                    usersEmployeeChoice.employeeManagerChange;
                                connection.query(
                                    `update employee
                            set manager_id = ?
                            where id = ?`,
                                    [newManagerId, employeesId],
                                    (err, res) => {
                                        if (err) console.log(err);
                                        console.log(res);
                                    }
                                );
                                console.log("");
                            });
                    }
                );
            });
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

checkTable = (tableName) => {
    connection.query(`select * from ${tableName}`, (err, res) => {
        if (err) console.log(err);
        if (res.length > 0) return true;
        return false;
    });
};

// mainMenu();
// removeEmployee();
// updateEmployeeRole();
// editEmployeeMenu();
updateEmployeeManager();
