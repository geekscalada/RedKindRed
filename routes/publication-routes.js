const express = require('express');
const publicationController = require('../controllers/publication-controller');

// con esta llamada a router tendremos acceso a los métodos http de express
const api = express.Router();
const middleware_auth = require('../middlewares/auth')


// aquí cargamos el modulo multiparty que es un middleware para subidas de ficheros
// después creamos una variable middleware a la que le damos un directorio
// tenemos que crear las carperas uploads/users
var multipart = require('connect-multiparty')
var middleware_upload = multipart({uploadDir: './uploads/publicaciones'})


// definimos las rutas y los métodos a los que llamará cada ruta
api.get('/probando', middleware_auth.jwtAuth, publicationController.probando)
api.post('/publication', [middleware_auth.jwtAuth, middleware_upload], publicationController.savePublication)
api.get('/publications/:page?', middleware_auth.jwtAuth, publicationController.getPublications)
api.get('/publication/:id', middleware_auth.jwtAuth, publicationController.getPublication)
api.delete('/publication/:id', middleware_auth.jwtAuth, publicationController.deletePublication)
api.post('/upload-image-pub/:id', [middleware_auth.jwtAuth, middleware_upload], publicationController.uploadImage)
api.get('/get-image-pub/:imageFile', publicationController.getImageFile)






//recuerda que tienes que cargar estas rutas en el conf.js
module.exports = api;
