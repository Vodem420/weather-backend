const express = require('express');
const app = express();
//const createError = require('http-errors');
//const path = require('path');
//const http = require('http');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const logger = require('morgan');
const api = require('./routes/api.js');

app.set('view engine', 'html');
app.set('views', './frontend/dist/WeatherApp');
app.use(express.static(`${__dirname}/frontend/dist/WeatherApp`));
app.use('/api', api);
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function (req, res) {
   res.redirect('/');
});

// app.all('*', (req, res) => {
//    res.sendfile(__dirname + '/frontend/dist/WeatherApp/index.html');
// });

let server = app.listen(3000, function () {
   let host = server.address().address;
   let port = server.address().port;
   
   console.log("Weather website is up at http://%s:%s", host, port);
});

module.exports = app;
