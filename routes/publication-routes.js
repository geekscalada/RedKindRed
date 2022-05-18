//#publicationRoutes
const appexpress = require('express');
const publicationController = require('../controllers/publication-controller');

// con esta llamada a router tendremos acceso a los métodos http de express
const api = appexpress.Router();
const middlewareAuthentification = require('../middlewares/auth')


// aquí cargamos el modulo multiparty que es un middleware para subidas de ficheros
// después creamos una variable middleware a la que le damos un directorio
// tenemos que crear las carperas uploads/users
const multipart = require('connect-multiparty')
const middlewareUpload = multipart({uploadDir: './uploads/publicaciones'})


// definimos las rutas y los métodos a los que llamará cada ruta
api.post('/publication', [middlewareAuthentification.jwtAuth, middlewareUpload], publicationController.savePublication)
api.get('/publications/:page?', middlewareAuthentification.jwtAuth, publicationController.getPublications)
api.get('/get-image-pub/:imageFile', middlewareAuthentification.jwtAuth, publicationController.getImageFile)
module.exports = api;
