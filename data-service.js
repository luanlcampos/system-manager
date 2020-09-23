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
