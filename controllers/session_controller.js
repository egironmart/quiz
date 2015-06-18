//Comprobación de autorización de acceso
exports.loginRequired = function (req, res, next){
   if (req.session.user){
      next();
   } else {
      res.redirect('/login');
   }
};

// Get /login -> Formulario de login
exports.new = function(req, res) {
   var errors = req.session.errors || {};
   req.session.errors = {};
   res.render('sessions/new', {errors: errors});
};

// Post /login -> Crea la sesión
exports.create = function(req, res) {
   var login = req.body.login;
   var password = req.body.password;

   var userController = require('./user_controller');
   userController.autenticar (login, password, function(error, user){
      if (error) {   //Si hay un error, presentamos un mensaje
         req.session.errors = [{"message": 'Se ha producido un error: '+error}];
         res.redirect('/login');
         return;
      }

      //Creamos req.session.user y guardamos el id y el username
      //La sesión se define por la existencia de req.session.user
      req.session.user = {id: user.id, username: user.username};
      res.redirect(req.session.redir); //Redirecciona al path anterior al login
   });
};

//Delete /logout -> Destruír la sesión
exports.destroy = function(req, res) {
   delete req.session.user;
   res.redirect(req.session.redir); //Redirecciona al path anterior al login
};
