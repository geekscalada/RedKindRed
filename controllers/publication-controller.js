//#publicationController
const path = require('path')
const fs = require('fs')
const moment = require('moment')

// para promisificar fs.exists
const { promisify } = require('util')


const Blob = require('node-blob'); // borrar si finalmente no uso blob en la api (desinstalar tb)



// Database and sequelize
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database.js')


// Models
let User = require('../models/user')(sequelize, Sequelize);
let Publication = require('../models/publication')(sequelize, Sequelize);
let Key = require('../models/key')(sequelize, Sequelize);
let Friend = require('../models/friend')(sequelize, Sequelize)

//Associations 
User.hasOne(Key, { foreignKey: 'userId' });
Key.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Friend, { foreignKey: 'IDtarget' })
Friend.belongsTo(User, { foreignKey: 'IDtarget' })

module.exports = class publicationController {

    static async savePublication(req, res) {
        try {    
            let publication = JSON.parse(req.body.publication);
            let path = req.files.files.path;
            let fileSplit = path.split('\/');
            let fileName = fileSplit[(fileSplit.length)-1]
    
            //#cambiar por un throw
            if (!publication) return res.status(404).send({ message: 'Por favor, envia todos los campos' })
    
            let newPublication = await Publication.build({
                text: publication['text'],
                name: req.user.name,
                file: fileName,
                userID: req.user.id
            })
    
            let insertPublication = await newPublication.save();
            return res.status(200).send({
                message: 'Publicado!'
            })
    
        } catch (error) {
            console.log(error)
            return res.status(404).send({
                message: 'Error al publicar'
            })
        }
    
    }
    
    static async  getPublications(req, res) {
              
        
        let myFriends = await Friend.findAll({
            where: {'IDtarget' : req.user.id, 'status' : 'accepted'}
        })
    
        let myFriendsandme = []
    
        for(let idfriend in myFriends){
    
            myFriendsandme.push(myFriends[idfriend]['IDfriend'])
    
        }   
    
        myFriendsandme.push(req.user.id.toString())    
    
        try {           
    
            const options = {
            
                page: req.params.page, // Default 1
                paginate: 27, // Default 25        
                where: {userID: myFriendsandme}
            }
        
            const { docs, pages, total } = await Publication.paginate(options)    
            
            
            //#TODO #cambiar #arreglar esto
            return res.status(200).send({             
                docs,
                pages,
                paginate : options.paginate, 
                total
            })
    
        } catch (error) {
            return res.status(404).send({             
                Message: 'Ha ocurrido un error en la petición'
            })
            
        }
    }


    static async  getPublicationsv2(req, res) {

        let myFriends = await Friend.findAll({
            where: {'IDtarget' : req.user.id, 'status' : 'accepted'}
        })
    
        let myFriendsandme = []
    
        for(let idfriend in myFriends){
    
            myFriendsandme.push(myFriends[idfriend]['IDfriend'])
    
        }   
    
        myFriendsandme.push(req.user.id.toString())    
    
        try {
            const options = {
            
                page: req.params.page, // Default 1
                paginate: 4, // Default 25        
                where: {userID: myFriendsandme}
            }
        
            const { docs, pages, total } = await Publication.paginate(options)    
             
            //#TODO #cambiar #arreglar esto
            return res.status(200).send({             
                docs,
                pages,
                total
            })
    
        } catch (error) {
            return res.status(404).send({             
                Message: 'Ha ocurrido un error en la petición'
            })
            
        }
    }

   
    
    static async getImageFile(req, res) {
        
        let image = req.params.imageFile;
        let mypath = './uploads/publicaciones/'+image  


        let myFriends = await Friend.findAll({
            where: {'IDtarget' : req.user.id, 'status' : 'accepted'}
        })
    
        let myFriendsandme = []
    
        for(let idfriend in myFriends){
    
            myFriendsandme.push(myFriends[idfriend]['IDfriend'])
    
        }   
    
        myFriendsandme.push(req.user.id)

        console.log(myFriendsandme)

        let myImgUserId = await Publication.findOne({
            where: {'file': image }
        })        
        
        const isMyFriendPub = myFriendsandme.indexOf(myImgUserId.userID)

        if (isMyFriendPub < 0) {
            return res.status(404).send({ message: 'No tienes permisos para ver esta imagen' })
        }       
       
        
        //arreglar extension 

        console.log("--------------->",mypath)

               
        fs.exists(mypath, (exists) => {
    
            if (exists) {
                return res.sendFile(path.resolve(mypath))
                
            } else {                
                return res.status(200).send({ message: 'No hay imagen' })
            }
        })  
    }
    
    static async getImageFilev2(req, res) {
        
                
        let idPublication = req.params.idpub;
        

        let idOrdered = req.user.id;
        

        let readFileAsync = promisify(fs.exists)
        
        
        let publication = await Publication.findOne({
            where : {'id' : idPublication}
        })

        if (!publication){
            return res.status(404).send({ message: 'No hay publicacion' })            

        }

        let image = publication.file

        let mypath = './uploads/publicaciones/'+image
        let file = path.resolve(mypath);

        let exists = await readFileAsync(mypath);

        if (!exists) {
            return res.status(200).send({ message: 'No hay imagen' })            
        }        

        if(publication.userID == idOrdered) {
            console.log("estamos en este if")
            console.log(file)
            return res.sendFile(path.resolve(file))
        }

        let isMyFriendPub = await Friend.findOne({
            where: {'IDtarget' : idOrdered, 'status' : 'accepted', 'IDfriend' : publication.userID }
        })

        if (!isMyFriendPub){

            return res.status(404).send({ message: 'No tienes permiso para ver esta imagen' })            

        } 

        return res.sendFile(path.resolve(file))
       

    } 
    
}





