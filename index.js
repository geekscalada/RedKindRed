//#cambiar esto

const app = require('./conf');
const { Sequelize } = require('./database');
const port = 3900;  


// si esto no está conectado, el backend no estará comunicado
// con el frontend
const db = require('./database')
//require('./associations')
const associatons = require('./associations')

async function startBackend() {

  try {
    //await db.authenticate();
    app.listen(port, () => {
      console.log("http://192.168.33.39:3900 is OK")

      //Sincronizamos modelos con la base de datos
      db.sync({ force: false }).then(() => {
        console.log("sync")
      })

    })
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startBackend();

   
    
