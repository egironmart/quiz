var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//autoload de comandos con :quizId
router.param('quizId', quizController.load); //Autoload :quizId

//Definición de rutas de quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/busca',                quizController.busca);
router.get('/quizes/lista',                quizController.lista);
router.get('/autor/autor',                 quizController.autor);

module.exports = router;
