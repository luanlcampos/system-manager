var express = require("express");
var path = require("path");
var app = express();

var HTTP_PORT = process.env.HTTP_PORT || 8080;

console.log("Express http server listening on port " + HTTP_PORT);

app.use(express.static("public"))

app.get("/test", function(req, res){
    res.send("Testing it")
})
//sending the home page
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "views/home.html"))
})

//sending the about page
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "views/about.html"))
})

app.listen(HTTP_PORT);
