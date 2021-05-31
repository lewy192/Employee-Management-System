const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "departments",
});

const contentSeparator = "----------------\n";
connection.connect(function (err) {
    if (err) {
        return console.error("error: " + err.message);
    }
});
mainMenu = (greeting = "Back To") => {
    console.log(
        `---------------------------------\nWelcome ${greeting} The Main Menu\n---------------------------------\n\n`
    );
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
                "View All Roles By Department",
                "Add Role",
                "Add Department",
                "Add Employee",
                "Remove Employee",
                "Update Employees Role",
                // "View Total utilised budget of a dpeartment",
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
                            if (!res) {
                                console.log(
                                    "\nThere are no employees yet, try adding some and comeback!\n"
                                );
                                addEmployee();
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
                case "View All Employees By Manager":
                    connection.query(
                        `select concat(e2.first_name,', ',e2.last_name) as 'Employees Name', 
                    r.title as 'Employees Role',
                    CONCAT(e2.first_name,', ',e2.last_name) as 'Managers Name'
                    from employee e1 
                    inner join employee e2 on 
                    e1.manager_id = e2.id
                    inner join role r on 
                    e1.role_id = r.id`,
                        (err, res) => {
                            if (err) console.log(err);
                            if (!res) {
                                console.log("No employees by manager");
                            }
                            console.table(res);
                        }
                    );
                    break;
                case "View All Departments":
                    viewTable("department");
                    break;
                case "View All Roles":
                    viewTable("role");
                    break;
                case "View All Roles By Department":
                    viewRolesByDepartment();
                    break;
                case "Add Role":
                    addRoles();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employees Role":
                    updateEmployeeRole();
                    break;
                case "exit":
                    connection.end();
                    break;
                default:
                    mainMenu();
            }
        });
};

employeeChoicesArray = (responseArray) => {
    return responseArray.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));
};

viewRolesByDepartment = () => {
    connection.query(`select * from department`, (err, res) => {
        if (err) console.log(err);
        const departmentChoices = res.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));
        inquirer
            .prompt({
                name: "departmentSelected",
                message:
                    "Please Select the department whose roles you'd like to see",
                choices: departmentChoices,
                type: "list",
            })
            .then((answer) => {
                connection.query(
                    `select * from role where ?`,
                    { department_id: answer.departmentSelected },
                    (err, res) => {
                        if (err) console.log(err);
                        console.table(res);
                        mainMenu();
                    }
                );
            });
    });
};

// viewEmployeesByManager = () => {
//     connection.query(
//         "select * from employee where manager_id is null",
//         (err, res) => {
//             if (err) console.log(err);
//             console.table(res);
//             const managersSelection = employeeChoicesArray(res).push(null);
//             inquirer.prompt({ name: "managerChoice", type: "list",'Please Select a manger you want to sort by' });
//         }
//     );
// };

addEmployee = () => {
    connection.query("Select * from role", (err, res) => {
        if (err) console.log(err);
        const rolesToChooseFrom = employeeChoicesArray(res);
        if (!rolesToChooseFrom) {
            console.log(
                "-------\n There Are No Role To Choose From Please Create Atleast One Role First"
            );
            addRoles();
        }
        connection.query(
            "select * from employee where manager_id is null",
            (err, res) => {
                if (err) console.log(err);
                console.table(res);
                const managersSelection = employeeChoicesArray(res).push(null);
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
                            // TODO: if roles.length === 0 go add role
                            choices: rolesToChooseFrom,
                        },
                        {
                            name: "managerId",
                            message:
                                "Please enter the employees Manager Id: (null if manager)",
                            choices: managersSelection,
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
                                mainMenu();
                            }
                        );
                    });
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

        if (!employeeChoices) {
            console.log(
                `${contentSeparator} There are no employees to remove :(, try adding some${contentSeparator}`
            );
            addEmployee();
        }
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
                            mainMenu();
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
                                mainMenu();
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
                `DELETE FROM department WHERE ?`,
                { name: answer.departmentName },
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
            connection.query(
                `INSERT INTO department SET ?`,
                {
                    department_name: answers.departmentName,
                },
                (err, res) => {
                    console.log(res);
                    if (err) console.log(err);
                    console.log(
                        `-------------------\n${answers.departmentName} has been created\n-------------------\n\n`
                    );
                    mainMenu();
                }
            );
        });
};

addRoles = () => {
    connection.query(`select * from department`, (err, res) => {
        if (err) console.log(err);
        if (!res) {
            console.log(
                "------\nThere are no departments in your business yet. Add one and then comeback\n------`"
            );
            addDepartment();
        }
        const departements = res.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));
        inquirer
            .prompt([
                {
                    name: "roleDepartment",
                    message:
                        "Please Select the department where the new role belongs",
                    choices: departements,
                    type: "list",
                },
                {
                    name: "roleTitle",
                    message: "Enter the title of the new role:",
                    type: "input",
                },
                {
                    name: "roleSalary",
                    message: "Please enter the salary of the new role:",
                    type: "input",
                },
            ])
            .then((answers) => {
                connection.query(`insert into role set ? `, {
                    title: answers.roleTitle,
                    salary: answers.roleSalary,
                    department_id: answers.roleDepartment,
                });
                console.log(
                    `-------------------\n${answers.roleTitle} Has been created \n-------------------\n\n`
                );
                mainMenu();
            });
    });
};
viewTable = (tableName) => {
    connection.query(`SELECT * from ${tableName}`, (err, res) => {
        if (err) console.log(err);
        if (res.length > 0) {
            console.table(res);
            mainMenu();
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

mainMenu("To");
// removeEmployee();
// updateEmployeeRole();
// editEmployeeMenu();
// updateEmployeeManager();
// addEmployee();
// addRoles();
