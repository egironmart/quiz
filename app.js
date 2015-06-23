var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

var sesionAnt = "";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Usamos partial-express, soporte de vistas parciales
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());

app.use(cookieParser('quiz enrique'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


//Helpers dinámicos
app.use(function(req, res, next){
   //Guardar path en session.redir para después del login
   if (!req.path.match(/\/login|\/logout/)){
      req.session.redir = req.path;
   }

   //Hacer visible rreq.session en las vistas
   res.locals.session = req.session;
   next();
});


//Control de auto-logout
//Comprueba si han pasado 2 minutos y cancela la sesión
app.use(function(req, res, next){

   req.session.hora = new Date().getHours();
   req.session.minuto = new Date().getMinutes();
   var sesionAct = (req.session.hora * 60 * 60)+(req.session.minuto * 60); //Convertimos a segundos

   sesionAnt = sesionAnt || 0;
   if (!sesionAnt){
      sesionAnt = (new Date().getHours() *60 * 60) + (new Date().getMinutes() * 60); //Convertimos a segundos
   } else {
      if ( (sesionAct - sesionAnt) > 120){   //Si la diferencia es mayor de 120 seg. (2 minutos)
         delete req.session.user;            //destruímos el usuario.
      }
   }

   sesionAnt = sesionAct;   //Marcamos esta sesión como anterior

   next();
});

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}, errors: []
    });
});


module.exports = app;
