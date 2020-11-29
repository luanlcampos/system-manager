var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//setting the userSchema
var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User; //tbd on new connection

//connect to MongoDB
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://web322a6:web322a6@web322-a6.2zg0w.mongodb.net/db_a6?retryWrites=true&w=majority");
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};


module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2){
            reject("Passwords do not match!");
        }
        else {
            let newUser = new User(userData);
            newUser.save()
            .then(()=>{resolve();})
            .catch((err)=>{
                if(err.code === 11000) {
                    reject("Username already taken.");
                }
                else {
                    reject(`There was an error creating the user: ${err}`);
                }
            })
        }
    })
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
       User.find({"userName": userData.userName})
        .then((users) => {
            if (!users) {
                console.log("User error")
                reject(`Unable to find user: ${userData.userName}`);
            }
            else if (users[0].password != userData.password){
                reject(`Incorrect Password for user: ${userData.userName}`);
            }
            else  {
                users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent:userData.userAgent});
                User.update(
                    {userName: userData.userName},
                    {$set: 
                        {loginHistory: users[0].loginHistory}//fields
                    }//set                
                )//update
                .exec()
                .then(() =>{
                    resolve(users[0]);
                })
                .catch((err) => {
                    reject(`There was an error verifying the user: ${err}`);
                })
            }//else
        }) //then of find 
        .catch((err) => {
            reject(`Unable to find user: ${userData.userName}`);
        })
    })
}