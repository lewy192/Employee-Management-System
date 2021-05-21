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
