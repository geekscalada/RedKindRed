//#cambiar esto

var mongoose = require('mongoose');
var app = require('./conf');
const { Sequelize } = require('./database');
var port = 3900;  //se podría cargar por variale de entorno

// promisificando mongoose, probably change it
mongoose.Promise = global.Promise;

// conect to DB
//#cambiar, en realidad borrar
mongoose.connect('mongodb://jose:12345@localhost:27018/red-kind-red')
.then(() => {

        console.log("Conexion correcta")

        // aquí aprovechamos para crear la conexión del server
       

    })
.catch(err => {console.log(err)})



// si esto no está conectado, el backend no estará comunicado
// con el frontend

const db = require('./database')
//require('./associations')
const associatons = require('./associations')

    async function prueba() {
    
      try {
        //await db.authenticate();
        app.listen(port, () => {
            console.log("http://192.168.33.39:3900 is OK")
            
            db.sync({force: false}).then(()=>{ 
              console.log("sync")})

        })
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    };

    prueba();

   
    
