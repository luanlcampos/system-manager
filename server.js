/********************************************************************************* * WEB322 – Assignment 02 
 I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part  
 of this assignment has been copied manually or electronically from any other source 
 (including 3rd party web sites) or distributed to other students. * 
 Name: Luan Lima Campos Student ID: 119386191 Date: 2020-09-23 * 
 Online (Heroku) Link: https://pacific-stream-59450.herokuapp.com * 
 ********************************************************************************/
var data = require("./data-service") //requiring all functions from data-service.js
var express = require("express")
var path = require("path") 
var multer = require("multer") //deal with images
var bodyParser = require("body-parser") //deal with forms
var app = express() //start an express app
var fs = require("fs") //fs.readdir
app.use(express.static('public')); //set the public dir as static
app.use(express.static(path.join(__dirname, 'views'))) //set the views dir as static
app.use(bodyParser.urlencoded({extended : true})) 

var HTTP_PORT = process.env.PORT || 8080

//setting the disk storage
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage : storage});


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
    //getting employees by status
    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status)
        .then((data) => {
            res.json(data)
        }).catch((err) => {
            res.json({message: err})
        })
    }

    //getting employees by department
    else if(req.query.department) {
        data.getEmployeesByDepartment(req.query.department)
        .then((data) => {
            res.json(data)
        }).catch((err) => {
            res.json({message: err})
        })
    }

    //getting employees by manager id
    else if(req.query.manager) {
        data.getEmployeesByManager(req.query.manager)
        .then((data) => {
            res.json(data)
        }).catch((err) => {
            res.json({message: err})
        })
    }
    
    //getting all employees
    else {
        data.getAllEmployees()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json({message: err})
        })
    }    
})

//getting an employee by id in the url
app.get("/employee/:value", (req, res) => {
    data.getEmployeeByNum(req.params.value)
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json({message: err})
    })
})

//route to load the page with the form to add a new employee
app.get("/employees/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"))
})


//route to load the page with all the images in a json format
app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", (err, image) => {
        res.json(image);
    })  
})

////route to load the page with the form to add a new image
app.get("/images/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addImage.html"))
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

//posts
//post to image adding
app.post("/images/add", upload.single('imageFile'), (req, res) => {
    res.redirect('/images')
})

//post to employees adding
app.post("/employees/add", (req, res) => {
    if(data.addEmployee(req.body)){
        res.redirect('/employees')
    }
})


//all the other paths, send the not found page
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "views/notfound.html"))
})




//first read the data, then if it returns a resolve, it loads the server
data.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("Express http server listening on port http://localhost:" + HTTP_PORT)
    })
}).catch((err) => {
    console.log(err)
});

//app.listen(HTTP_PORT)
