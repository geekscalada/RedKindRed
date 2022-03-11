//#userRoutes
const appexpress = require('express');
const userController = require('../controllers/user-controller');

// con esta llamada a router tendremos acceso a los métodos http de express
const api = appexpress.Router();
const middlewareAuthentication = require('../middlewares/auth')


// aquí cargamos el modulo multiparty que es un middleware para subidas de ficheros
// después creamos una variable middleware a la que le damos un directorio
// tenemos que crear las carpertas uploads/users
var multipart = require('connect-multiparty')
var middlewareUpload = multipart({uploadDir: './uploads/usuarios'})

// definimos las rutas y los métodos a los que llamará cada ruta
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
//rutas con middleware
api.get('/allusers', middlewareAuthentication.jwtAuth, userController.getAllUsers)
api.put('/update-user/:id', middlewareAuthentication.jwtAuth, userController.updateUser)
api.post('/upload-image-user/:id', middlewareUpload, userController.uploadImage)
api.get('/get-image-user/:imageFile', userController.getImageFile)
api.post('/sendReqFriend', middlewareAuthentication.jwtAuth, userController.sendRequestToFriend)
api.get('/getFriends/:id', middlewareAuthentication.jwtAuth, userController.getFriends)
api.get('/getMyReqFriends/:id', middlewareAuthentication.jwtAuth, userController.getMyReqFriends)
api.get('/getMyOwnReqFriends/:id', middlewareAuthentication.jwtAuth, userController.getMyOwnReqFriends)
api.post('/getIdentityFromDB', userController.getIdentityFromDB)


module.exports = api;
