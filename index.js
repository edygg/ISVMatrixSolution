var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

// Database config
var dbConfig = require('./config/database.config');
var stringConnection = 'mongodb://';

if (dbConfig.username && dbConfig.password) {
  stringConnection += dbConfig.username + ':' + dbConfig.password + '@';
}

stringConnection += dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.database;

mongoose.connect(stringConnection);

// Routers
var homeRouter = require('./routes/home.router');
var apiRouter = require('./routes/api.router');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.set('views', __dirname + '/frontend/views');
app.set('view engine', 'ejs');

app.use('/', homeRouter);
app.use('/api', apiRouter);

//App config
var appConfig = require('./config/app.config');
var port = appConfig.port || 3000;

app.listen(port, function () {
  console.log('app listening on port ' + port + '!');
});
