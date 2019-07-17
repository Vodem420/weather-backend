const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const fetch = require("node-fetch");
const upload = multer();
const http = require('https');
const fs = require('fs');
const router = express.Router();
const APPID = '2e7e1d8fabd7c153330e11d1f13782d9';

let API_URL = 'https://api.openweathermap.org/data/2.5/weather?q=';
let Users = [];

router.use(session({secret: "Your secret key"}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());
router.use(upload.array());
router.use(express.urlencoded());

router.route('/')
    .get(function (req, res) {
        res.redirect('/');
    });

router.route('/login')
    .get(function(req, res){
        console.log("login GET get");
        res.redirect("/login");
    })
    .post(function(req, res){
        console.log("login POST get");
      if(!req.body.email || !req.body.password){
        res.redirect('/login');
      } else {
        Users.filter(function(user){
          if(user.email === req.body.email && user.password === req.body.password){
            req.session.user = user;
            console.log("User %s logged in.", req.session.user.name);
            res.redirect('/user');
          }
        });
        res.redirect('/login');
      }
    });

router.route('/register')
    .get( function(req, res){
        console.log("signup GET get");
        res.redirect("/register");
        //res.send("Hello");
    })
    .post( function(req, res){
        console.log("signup POST get");

      if(!req.body.EmailAddress || !req.body.Password || !req.body.nickname){
          console.log(req.body);
          res.status("400");

      } else if(Users.find(function (user) {
        return user.EmailAddress === req.body.EmailAddress;
      })){
          console.log("Email is in use");
      } else {
        let newUser = {
            nickname: req.body.nickname,
            EmailAddress: req.body.EmailAddress,
            Password: req.body.Password
        };
        Users.push(newUser);
        req.session.user = newUser;


        console.log("User %s signed up.", req.body.nickname);
        //res.redirect('/');
          res.send("Success");
      }
    });

router.route('/user')
    .get( function(req, res){
        if(req.session.user) {res.redirect('/user');}
        else res.redirect('/login');
    });

router.get('/logout', function(req, res){
    let name = req.session.user.name;
    req.session.destroy(function(){
    console.log("User %s logged out.", name);

  });
  res.redirect('/login');
});

module.exports = router;