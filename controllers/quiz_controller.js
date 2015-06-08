var models = require('../models/models.js');

//Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
   models.Quiz.find(quizId).then(
      function(quiz) {
         if (quiz) {
            req.quiz = quiz;
            next();
         } else {next(new Error('No existe el quiz con Id=' + quizId));}
      }
   ).catch(function(error) {next(error);});
}

//Get /quizes
exports.index = function(req, res) {
   models.Quiz.findAll().then(function(quizes) {
     res.render('quizes/index.ejs', {quizes: quizes});
   }).catch(function(error) {next(error);});
};

//Get /quizes/busca
exports.busca = function(req, res) {
     res.render('quizes/busca.ejs', {});
}
//Get /quizes/lista
exports.lista = function(req, res) {
console.log("en req "+req.query.busca);
//console.log("en res "+res.query.busca);
   var cambia = req.query.busca.replace(/ /g,'%');
   var texto = " pregunta like '%"+cambia+"%'";

   models.Quiz.findAll({where: texto}).then(function(quizes) {
     res.render('quizes/lista.ejs', {quizes: quizes});
   }).catch(function(error) {next(error);});
};

//Get quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz});
};

//GET quizes/:id/answer
exports.answer = function(req, res) {
   var resultado = 'Incorrecto';
   if (req.query.respuesta === req.quiz.respuesta){
      resultado = 'Correcto';
   }
   res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

//Get quizes/question
exports.autor = function(req, res) {
   res.render('autor/autor', {});
};
