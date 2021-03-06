//#configuration file
// Aquí tendremos la configuracion de express

const appexpress = require('express')
//#don't needed 
const appbodyParser = require('body-parser')
const app = appexpress(); 
const appcors = require('cors');
//#don't needed
const associations = require('./associations')

// cargar rutas
const user_rt = require('./routes/user-routes');
const publications_rt = require('./routes/publication-routes')

//body-parser new codification
// sirve para que las peticiones se conviertan a JSON
app.use(appexpress.urlencoded({extended: true}));
app.use(appexpress.json()); 

// cors
// esto es para escribir las cabeceras y habilitar el acceso CORS de manera que evitemos problemas
// de las peticiones ajax
app.use(appcors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'HEAD'],
    origin: '*'
}));

// rutas
//definimos que la ruta será /api/foo
//app.use nos permitirá usar middlewares
app.use('/api', user_rt);
app.use('/api', publications_rt);


// En principio no necesario, lo hace nginx. 
app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      "worker-src blob:; child-src blob: gap:; img-src 'self' blob: data:; default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:"
    );    
  });


//exportamos
module.exports = app; // exportamos el objeto app