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
const obj = {
    full_name: `${employee.first_name} ${employee.last_name}`,
    id: employee.id,
};

// selectEmployee = () => {
//     return new Promise(function (resolve, reject) {
//         connection.query(`select * from employee`, (err, res) => {
//             if (err) console.log(err);
//             const employeeChoices = res.map((employee) => {
//                 const obj = {
//                     name: `${employee.first_name} ${employee.last_name}`,
//                     value: employee.id,
//                 };
//                 return obj;
//             });
//             // return employeeDetails;
//             console.log(`SELECT EMPLOYEE: ${employeeChoices}`); //TODO: why does this return: SELECT EMPLOYEE: [object Object],[object Object]
//             resolve(employeeChoices);
//             console.log(`SELECT EMPLOYEE: ${employeeChoices}`);
//         });
//     });
// };
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
