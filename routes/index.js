var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//autoload de comandos con :quizId
router.param('quizId', quizController.load); //Autoload :quizId

//Definición de las rutas de sesión
router.get('/login',  sessionController.new); //Formulario de login
router.post('/login', sessionController.create); //Crear sesión
router.get('/logout', sessionController.destroy); //Destruír sesión

//Definición de rutas de quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/busca',                quizController.busca);
router.get('/quizes/lista',                quizController.lista);
router.get('/quizes/new',                  quizController.new);
router.post('/quizes/create',              quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   quizController.edit);
router.put('/quizes/:quizId(\\d+)',        quizController.update);
router.delete('/quizes/:quizId(\\d+)',     quizController.destroy);
router.get('/autor/autor',                 quizController.autor);

router.get('/quizes/:quizId(\\d+)/comments/new',   commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',      commentController.create);

module.exports = router;
