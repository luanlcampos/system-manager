const fs = require('fs');

var employees = []
var departments = []

//all the functions should return a Promise and pass its data through resolve method or reject method.
//also use .then() and .catch()

module.exports.initialize = function() {
        return new Promise(function(resolve, reject){
            fs.readFile('./data/employees.json', 'utf-8', function(err, data){
                if (err) reject (err);
                employees = JSON.parse(data);
            })
            fs.readFile('./data/departments.json', 'utf-8', function(err, data){
                if (err) reject (err);
                departments = JSON.parse(data);
            })
            resolve();
        })
}

module.exports.getAllEmployees = () => {
        return new Promise(function(resolve, reject){
                if(employees.length == 0) reject("No results returned.");
                resolve(employees);
        })
}

module.exports.getManagers = () => {
        return new Promise (function(resolve, reject) {
                var manager = [];
                for (var i = 0; i < employees.length; i++) {
                        if(employees[i].isManager) {
                                manager.push(employees[i])
                        }
                }
                if(manager.length == 0) reject("No results returned.");
                resolve(manager);
        })
}

module.exports.getDepartments = () => {
        return new Promise (function(resolve, reject) {
                if(departments.length == 0) reject("No results returned.");
                resolve(departments);
        })
}

module.exports.addEmployee = (employeeData) => {
        return new Promise (function(resolve, reject){
                if (!employeeData) reject ("Not able to read")
                else {
                        if (employeeData.isManager == undefined) {
                                employeeData.isManager = false;
                        } 
                        else employeeData.isManager = true;
                        employeeData.employeeNum = employeeData.length + 1; //setting the employee id to be the last id + 1
                        employees.push(employeeData);

                }
                resolve();
        })
}


module.exports.getEmployeesByStatus = (status) => {
        return new Promise (function(resolve, reject) {
                var empByStatus = [];
                for (let i = 0; i < employees.length; i++) {
                        if (employees[i].status == status) {
                                empByStatus.push(employees[i]);
                        }
                }
                if (empByStatus.length == 0) reject("No results returned")
                else resolve(empByStatus);
        })
}

module.exports.getEmployeesByDepartment = (department) => {
        return new Promise (function(resolve, reject) {
                var empByDp = []
                for (let i =0; i < employees.length; i++) {
                        if (employees[i].department == department) {
                                empByDp.push(employees[i])
                        }
                }
                if (empByDp.length == 0) reject("No results returned")
                else resolve(empByDp)
        })          
}

module.exports.getEmployeesByManager = (manager) => {
        return new Promise((resolve, reject) => {
                var empByManager = []
                for (let i =0; i < employees.length; i++) {
                        if (employees[i].employeeManagerNum == manager) {
                                empByManager.push(employees[i])
                        }
                }
                if(empByManager.length == 0) reject("No results returned")
                else resolve(empByManager)
        })
}


module.exports.getEmployeeByNum = (num) => {
        return new Promise ((resolve, reject) => {
                let emp = null;
                for (let i =0; i < employees.length; i++) {
                        if (employees[i].employeeNum == num){
                                emp = employees[i];
                        }
                }
                if (!emp) reject ("No results returned")
                else resolve(emp)
        })
}

module.exports.updateEmployee = (employeeData) => {
        return new Promise ((resolve, reject) => {
                for (let i =0; i < employees.length; i++) {
                        if (employees[i].employeeNum == employeeData.employeeNum){
                                employees[i] = employeeData;
                                
                        }
                }
                if (employees.length == 0){
                        console.log("Into Update Employee IF condition")
                        reject("No Result Returned!");
                }
                
                resolve();
        })
}

