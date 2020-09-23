/********************************************************************************* * WEB322 – Assignment 02 
 I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part  
 of this assignment has been copied manually or electronically from any other source 
 (including 3rd party web sites) or distributed to other students. * 
 Name: Luan Lima Campos Student ID: 119386191 Date: 2020-09-23 * 
 Online (Heroku) Link: https://pacific-stream-59450.herokuapp.com * 
 ********************************************************************************/
var data = require("./data-service")
var express = require("express")
var path = require("path")
// const { initialize } = require("./data-service")
var app = express()

var HTTP_PORT = process.env.PORT || 8080


app.use(express.static("public"))

//sending the home page
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "views/home.html"))
})

//sending the about page
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "views/about.html"))
})

//managers route
app.get("/managers", function(req, res){
    //res.send("TODO: get all employees who have isManager==true")
    data.getManagers()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({message: err})
    })
})

//employees route
app.get("/employees", function(req, res){
    //res.send("TODO: display all of the employees within the employees.json file")
    data.getAllEmployees()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({message: err})
    })
})


//departments route
app.get("/departments", function(req, res){
    //res.send("TODO: display all of the departments within the departments.json file")
    data.getDepartments()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.json({message: err})
    })
})

app.get("*", function(req, res){
    res.send("Page not found")
})

//first read the data, then if it returns a resolve, it loads the server
data.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("Express http server listening on port " + HTTP_PORT)
    })
}).catch((err) => {
    console.log(err)
});

//app.listen(HTTP_PORT)
