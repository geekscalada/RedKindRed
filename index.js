//#index.js

const app = require('./express-conf');
const { Sequelize } = require('./config/database');
const port = 3900;  

const db = require('./config/database')

async function startBackend() {

  try {
    //await db.authenticate();
    app.listen(port, () => {
      console.log("url in port 3900 is OK")

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

   
    
