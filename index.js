var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Routers
var homeRouter = require('./routes/home.router');
var apiRouter = require('./routes/api.router');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'));
app.set('views', __dirname + '/frontend/views');
app.set('view engine', 'ejs');

app.use('/', homeRouter);
app.use('/api', apiRouter);

var port = 3000;

app.listen(port, function () {
  console.log('app listening on port ' + port + '!');
});
