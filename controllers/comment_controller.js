var models = require('../models/models.js');

//Get /quizes/:quidId/comments/new
exports.new = function(req, res){
   res.render('comments/new.ejs', {quizid: req.params.quizId, errors:[]});
};

//POST /quizes/:quidId/comments
exports.create = function(req, res){
   var comment = models.Comment.build(
      { texto: req.body.comment.texto,
        QuizId: req.params.quizId
      });
   comment.validate().then(
      function(err){
         if (err) {
            res.render('comments/new.ejs', {comment: comment, errors: err.errors});
         } else {
            comment.save().then(function(){res.redirect('/quizes/'+req.params.quizId)}) //guarda el comentario en la BD
         }
      }
   ).catch(function(error){next(error)});
};