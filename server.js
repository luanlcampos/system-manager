/********************************************************************************* * WEB322 – Assignment 02 
 I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part  
 of this assignment has been copied manually or electronically from any other source 
 (including 3rd party web sites) or distributed to other students. * 
 Name: Luan Lima Campos Student ID: 119386191 Date: 2020-09-23 * 
 Online (Heroku) Link: https://pacific-stream-59450.herokuapp.com * 
 ********************************************************************************/
const exphbs = require("express-handlebars")
var data = require("./data-service") //requiring all functions from data-service.js
var express = require("express")
var path = require("path")
var multer = require("multer") //deal with images
var bodyParser = require("body-parser") //deal with forms
var app = express() //start an express app
var fs = require("fs") //fs.readdir
app.use(express.static('public')); //set the public dir as static
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
})); //process .hbs files
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'views'))) //set the views dir as static
app.use(bodyParser.urlencoded({ extended: true }))

var HTTP_PORT = process.env.PORT || 8080

//setting the disk storage
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });

//setting the active
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path; app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
})

// ************ ROUTES *************
//sending the home page
app.get("/", function (req, res) {
    res.render(path.join(__dirname, "views/home.hbs"))
})

//sending the about page
app.get("/about", function (req, res) {
    res.render(path.join(__dirname, "views/about.hbs"))
})

//employees route
app.get("/employees", function (req, res) {
    //getting employees by status
    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status)
            .then((data) => {
                res.render("employees", { "employees": data })
            }).catch((err) => {
                res.render({ message: "no results" });
            })
    }

    //getting employees by department
    else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department)
            .then((data) => {
                res.render("employees", { "employees": data })
            }).catch((err) => {
                res.render({ message: "no results" });
            })
    }

    //getting employees by manager id
    else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager)
            .then((data) => {
                res.render("employees", { "employees": data })
            }).catch((err) => {
                res.render({ message: "no results" })
            })
    }

    //getting all employees
    else {
        data.getAllEmployees()
            .then((data) => {
                res.render("employees", { "employees": data })
            })
            .catch((err) => {
                res.render({ message: "no results" })
            })
    }
})

//getting an employee by id in the url
app.get("/employee/:value", (req, res) => {
    data.getEmployeeByNum(req.params.value)
        .then((data) => {
            res.render("employee", { employee: data })
        }).catch((err) => {
            res.render({ message: "no results" })
        })
})

//route to load the page with the form to add a new employee
app.get("/employees/add", (req, res) => {
    res.render(path.join(__dirname, "/views/addEmployee.hbs"))
})


//route to load the page with all the images in a json format
app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", (err, image) => {
        res.render("images", { "images": image });
    })
})

////route to load the page with the form to add a new image
app.get("/images/add", (req, res) => {
    res.render(path.join(__dirname, "/views/addImage.hbs"))
})


//departments route
app.get("/departments", function (req, res) {
    //res.send("TODO: display all of the departments within the departments.json file")
    data.getDepartments()
        .then((data) => {
            res.render("departments", { "department": data });
        })
        .catch((err) => {
            res.send({ message: err })
        })
})

//posts
//post to image adding
app.post("/images/add", upload.single('imageFile'), (req, res) => {
    res.redirect('/images')
})

//post to employees adding
app.post("/employees/add", (req, res) => {
    if (data.addEmployee(req.body)) {
        res.redirect('/employees')
    }
})

app.post("/employee/update", (req, res) => { 
    data.updateEmployee(req.body) 
    .then((data) => {
        res.redirect("/employees")
    })
    .catch((err) => {
        console.log(err)
    })
     
});

//all the other paths, send the not found page
app.get("*", function (req, res) {
    res.render(path.join(__dirname, "views/notfound.hbs"), { layout: false })
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
