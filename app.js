//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/userDB').then(
  (connect) => {
    console.log("Connected to localhost server sucessfully.");
  }
)

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {
  encryptedFields: ["password"],
  secret:process.env.SECRET
});

const User = new mongoose.model("User", userSchema);

app.post("/register", (req,res) => {
  const userEmail = req.body.username;
  const userPassword = req.body.password;
  const newUser = new User({
    email: userEmail,
    password: userPassword
  });
  newUser.save().then((savedUser) => {
    res.render("secrets");
  })
});


app.post("/login", (req, res) => {
  const userEmail = req.body.username;
  const userPassword = req.body.password;
  User.findOne({email: userEmail}).then((foundUser) =>{
    if (foundUser) {
      if (foundUser.password === userPassword) {
        res.render("secrets");
      }
    } else{
      res.send("No user found.");
    }
  })
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});


app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
})
