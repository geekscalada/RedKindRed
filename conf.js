//#cambiado
// Aquí tendremos la configuracion de express

const appexpress = require('express') 
const appbodyParser = require('body-parser')
const app = appexpress(); 
const appcors = require('cors');

const associations = require('./associations')


// cargar rutas
const user_rt = require('./routes/user-routes');
const publications_rt = require('./routes/publication-routes')


// middlewares
    
    //body-parser new codification
app.use(appexpress.urlencoded({extended: true}));
app.use(appexpress.json());
// esto va a servir xa que cada una de las peticiones que hagamos a nuesto BE, lo que recibamos
// se convierta en un JSON.
 

// cors
// esto es para escribir las cabeceras y habilitar el acceso CORS de manera que evitemos los típicos problemas
// de las peticiones ajax

app.use(appcors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    origin: '*'
}));

// rutas
//definimos que la ruta será /api/foo
//app.use nos permitirá usar middlewares
app.use('/api', user_rt);
app.use('/api', publications_rt);


//exportamos

module.exports = app; // exportamos todo lo que tenga app.