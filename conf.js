//app.js -> conf.js

// configuracion de express


//#cambiar esto


var express = require('express') //cambiar nombre?
var bodyParser = require('body-parser') // cambiar nombre?

var app = express(); //cambiar nombre
const cors = require('cors');

const associations = require('./associations')


// cargar rutas

var user_routes = require('./routes/user-routes');
var follow_routes = require('./routes/follow-routes')
var publications_routes = require('./routes/publication-routes')
var message_routes = require('./routes/message-routes')

// middlewares
    //son métodos que se ejecutan antes de que lleguen a un controlador, y nos lo
    // pide bodyparser

//deprecadas, cambiar?
    // app.use(bodyParser.urlencoded({extended:false}))
    // app.use(bodyParser.json());

// ya no se necesita importar bodyParser nunca más
app.use(express.urlencoded({extended: true}));
app.use(express.json());
    // esto va a servir xa que cada una de las peticiones que hagamos a nuesto BE, lo que recibamos
    // se convierta en un JSON. 

    

// cors
// esto es para escribir las cabeceras y habilitar el acceso CORS de manera que evitemos los típicos problemas
// de las peticiones ajax

// example vr
// esto lo que haría es que sería un middleware que cada petición que se haga pase primero por aqui
// y se establezcan las cabeceras correctamente
// por ejemplo si hago una petición desde hola.com a hola2.com y hola2.com no permite el acceso entoces no puedo hacer
// una petición ajax y no puedo traer los datos del servicio rest

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });


// other ex

app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    origin: '*'
}));





// rutas

//aqui estamos cargando las rutas de usuario
// además el app.use nos permite usar un middleware que llega antes que la acción
// del controlador, en este caso lo que le decimos que es que la ruta será
// /api/lo-que-sea
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publications_routes);
app.use('/api', message_routes);


    // aqui empezamos creando una ruta en get xq cuando vamos al navegador con el server express
    // ya escuchando nos dice cannot get / y esto es porque no hay una ruta definida

//metodo get para crear una ación en el http get
// se genera con un método callback request -> lo que nos llega
// response -> lo que devolvemos

                // app.get('/pruebas',(req, res) => {

                //     res.status(200).send({
                //         message: 'Pruebas en server'
                //     })

                // });

// ### es un ejemplo de cómo haríamos unas rutas de prueba en get esto luego lo quitamos
// y lo que hacemos es definir unos métodos en el controlador a los que hará referencia
// unas rutas, de manera que cuando accedamos a estas rutas, se ejecutarán
// dichos métodos


//exportamos



module.exports = app; // exportamos todo lo que tenga app.