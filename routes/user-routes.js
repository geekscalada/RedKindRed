'use strict'

var express = require('express');
var userController = require('../controllers/user-controller');

// con esta llamada a router tendremos acceso a los métodos http de express
var api = express.Router();
var middleware_auth = require('../middlewares/auth')


// aquí cargamos el modulo multiparty que es un middleware para subidas de ficheros
// después creamos una variable middleware a la que le damos un directorio
// tenemos que crear las carperas uploads/users
var multipart = require('connect-multiparty')
var middleware_upload = multipart({uploadDir: './uploads/usuarios'})


// definimos las rutas y los métodos a los que llamará cada ruta
api.get('/home', userController.home);
api.get('/pruebas', userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser)
//estas rutas ua incluyen el middelware como segundo parámetro, 
// están obligadas a pasar por el middelware primero
api.get('/pruebas2', middleware_auth.ensureAuth ,userController.pruebas);
api.get('/user/:id', middleware_auth.ensureAuth, userController.getUser)
api.get('/users/:page?', middleware_auth.ensureAuth, userController.getUsers)
api.get('/allusers', middleware_auth.ensureAuth, userController.getAllUsers)
api.get('/counters/:id?', middleware_auth.ensureAuth, userController.getCounters)
api.put('/update-user/:id', middleware_auth.ensureAuth, userController.updateUser)
// array de middlewares
api.post('/upload-image-user/:id', middleware_upload, userController.uploadImage)
//probablemente no necesitamos autentificacion (quitar middleware)
api.get('/get-image-user/:imageFile', userController.getImageFile)
api.post('/sendReqFriend', middleware_auth.ensureAuth, userController.sendRequestToFriend)
api.get('/getFriends/:id', middleware_auth.ensureAuth, userController.getFriends)
api.get('/getMyReqFriends/:id', middleware_auth.ensureAuth, userController.getMyReqFriends)


//:id es porque le estamos pasando un parámetro por la url
// si quisiéramos hacerlo opcional tendríamos que poner id?



//recuerda que tienes que cargar estas rutas en el conf.js
module.exports = api;
