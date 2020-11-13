
//all the functions should return a Promise and pass its data through resolve method or reject method.
//also use .then() and .catch()

const Sequelize = require('sequelize');
//Setting dabatase connection
var sequelize = new Sequelize('dh3q1s84455hu', 'htijeihdyixvew', '2c34c779de747790c04e61fff70e825dc454761fb59b6eb9d312d860f09b539d', {
        host: 'ec2-23-20-168-40.compute-1.amazonaws.com',
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
                ssl: true,
                rejectUnauthorized: false
        }
});

//creating tables
//Employee Table/model
var Employee = sequelize.define('Employee', {
        employeeNum: {type: Sequelize.INTEGER,
                      primaryKey: true,
                      autoIncrement: true},
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        SSN: Sequelize.STRING,
        addressStreet: Sequelize.STRING,
        addressState: Sequelize.STRING,
        addressPostal: Sequelize.STRING,
        maritalStatus: Sequelize.STRING,
        isManager: Sequelize.BOOLEAN,
        employeeManagerNum: Sequelize.INTEGER,
        status: Sequelize.STRING,
        department: Sequelize.INTEGER,
        hireDate: Sequelize.STRING
});
//Setting Department Model
var Department = sequelize.define('Department', {
        departmentId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
        },
        departmentName: Sequelize.STRING
});

module.exports.initialize = function() {
        return new Promise(function(resolve, reject){
                sequelize.sync().then(() => { //connect to the database
                        resolve();
                }).catch(() => {
                        reject("Unable to sync the database");
                })
        })
}

module.exports.getAllEmployees = () => {
        return new Promise(function(resolve, reject){
                Employee.findAll().then((data) => {
                        resolve(data);
                }).catch((err) => {
                        reject("No results returned.");
                })
        })
}

module.exports.getManagers = () => {
        return new Promise (function(resolve, reject) {
               Employee.findAll({where: {
                        isManager: true
                } 
                }).then((data)=>{
                        resolve(data)
                }).catch((err)=> {
                        reject("No results returned.")
                })
        })
}

module.exports.getDepartments = () => {
        return new Promise (function(resolve, reject) {
                Department.findAll().then((data)=>{
                        resolve(data);
                }).catch((err)=> {
                        reject("No results returned.")
                })
        })
}

module.exports.addEmployee = (employeeData) => {
        return new Promise (function(resolve, reject){
                employeeData.isManager = employeeData.isManager? true : false;
                for (let i in employeeData){
                        if(employeeData[i] == "")
                                employeeData[i] = null;
                }
                Employee.create(employeeData).then(()=>{resolve("Employee added!");})
                .catch((err) => reject("Unable to create employee"));
        })
}


module.exports.getEmployeesByStatus = (status) => {
        return new Promise (function(resolve, reject) {
                Employee.findAll({where: {status: status}})
                .then((data) => {
                        resolve(data);
                }).catch((err) => {
                        reject("No results returned.");
                })
        })
}

module.exports.getEmployeesByDepartment = (department) => {
        return new Promise (function(resolve, reject) {
                Employee.findAll({where: {department: department}})
                .then((data)=> {
                        resolve(data);
                }).catch((err) => {
                        reject("No results returned.");
                })
        })          
}

module.exports.getEmployeesByManager = (manager) => {
        return new Promise((resolve, reject) => {
                Employee.findAll({where: {employeeManagerNum: manager}})
                .then((data)=>{
                        resolve(data);
                }).catch((err)=> {
                        reject("No results returned.");
                })
        })
}


module.exports.getEmployeeByNum = (num) => {
        return new Promise ((resolve, reject) => {
                Employee.findAll({where: {employeeNum: num}})
                .then((data)=>{
                        resolve(data);
                }).catch((err)=>{
                        reject("No results returned.");
                })
        })
}

module.exports.updateEmployee = (employeeData) => {
        return new Promise ((resolve, reject) => {
                employeeData.isManager = employeeData.isManager? true : false;
                for (let i in employeeData){
                        if(employeeData[i] == "")
                                employeeData[i] = null;
                }
                Employee.update(employeeData, {where: {employeeNum: employeeData.employeeNum}})
                .then(()=>{resolve();})
                .catch((err)=>{reject("Unable to update employee");})
        })
}

