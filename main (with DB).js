const express = require('express');
const session = require('express-session');
const multer = require('multer');
const upload = multer(); 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/weatherdb");

app.use(session({secret: "Your secret key"}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(upload.array());
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.urlencoded())

var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: Number
});

var User = mongoose.model("User", userSchema);

app.set('view engine','pug');

app.use('/user', function(err, req, res, next){
   console.log(err);
   res.redirect('/login');
});

app.get('/', function (req, res) {
   var data = fs.readFileSync('input.txt').toString();
   if(!req.session.user) res.render('index', {title: "Weather Forecast", hh: "Weather", message: data});
   else res.render('indexuser', {title: "Weather Forecast", hh: "Weather", message: data, name: req.session.user.name});
});

app.get('/signup', function(req, res){
   res.render('signup');
});

app.get('/login', function(req, res){
   res.render('login');
});

app.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("User logged out.")
   });
   res.redirect('/login');
});

app.get('/user', checkSignIn, function(req, res){
   res.render('userpage', {name: req.session.user.name})
});

app.post('/signup', function(req, res){
   if(!req.body.email || !req.body.password || !req.body.name){
      res.status("400");
      res.send("Invalid details!");
   } else if(req.body.password != req.body.confirmpassword) {
      res.render('signup', {message: "Your passwords don't match"});
   }
   var newUser = new User({name: req.body.name, email: req.body.email, password: req.body.password});
   newUser.save(function(err, User){
      if(err) res.render('signup', {message: "Database error"});
      else {
         req.session.user = newUser;
         console.log("User signed up.")
         res.redirect('/user');
      }
   });
});

app.post('/login', function(req, res){
   if(!req.body.email || !req.body.password){
      res.render('login', {message: "Please enter both email and password"});
   } else {
        User.findOne({email: req.body.email, password: req.body.password}, function(err, req, res){
            req.session.user = User;
            console.log("User logged in.");
            res.redirect('/user');
    });
        res.render('login', {message: "Invalid credentials!"});
   }
});

function checkSignIn(req, res, next, err){
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Weather website is up at http://%s:%s", host, port);
});
