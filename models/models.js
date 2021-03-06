var path = require('path');

//Postgres DATABASE_URL = postgres://user:password@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar SQLite
//var sequelize = new Sequelize(null, null, null,{dialect: "sqlite", storage: "quiz.sqlite"});

var sequelize = new Sequelize(DB_name, user, pwd,
   { dialect: protocol,
     protocol: protocol,
     port: port,
     host: host,
     storage: storage, //Solo SQLite (.env)
     omitNull: true   //Solo Postgres
   }
);

//Importar definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Importar la definición de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

//Establece las relaciones entre tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //exporta definición de la tabla Quiz
exports.Comment = Comment; //Exporta la definción de la tabla Comment

//sequelize.sync() crea e inicializa la tabla de preguntas en BD
sequelize.sync().then(function() {
   //success ejecuta el manejador una vez creada la tabla
   Quiz.count().then(function (count){
      if (count === 0) { //la tabla se inicializa si está vacía
         Quiz.create({ pregunta: 'Capital de Italia?',
                       respuesta: 'Roma',
                       tema: 'humanidades'
                    });
         Quiz.create({ pregunta: 'Capital de Portugal?',
                       respuesta: 'Lisboa',
                       tema: 'humanidades'
                    })
         .then(function(){console.log('Base de datos inicializada!')});
      };
   });
});

