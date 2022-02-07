const path = require('path')
const fs = require('fs')
const moment = require('moment')


// Database and sequelize
const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize')
const sequelize = require('../database.js')


// Models
const Publication = require('../models/publication')(sequelize, Sequelize)
const Friend = require('../models/friend')(sequelize, Sequelize)

//associations
async function savePublication(req, res) {    

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

async function getPublications(req, res) {   
    
    let myFriends = await Friend.findAll({
        where: {'IDtarget' : req.user.id, 'status' : 'accepted'}
    })

    let myFriendsandme = []

    for(idfriend in myFriends){

        myFriendsandme.push(myFriends[idfriend]['IDfriend'])

    }   

    myFriendsandme.push(req.user.id.toString())    

    try {           

        const options = {
        
            page: req.params.page, // Default 1
            paginate: 2, // Default 25        
            where: {userID: myFriendsandme}
        }
    
        const { docs, pages, total } = await Publication.paginate(options)    
            
        //#cambiar #arreglar esto
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


function getImageFile(req, res) {

    console.log("estamso en el getImageFile")

    let  image = req.params.imageFile;   

    let mypath = './uploads/publicaciones/'+image    
    
    fs.exists(mypath, (exists) => {

        if (exists) {
            res.sendFile(path.resolve(mypath))
        } else {
            console.log("no existe iamgen???")
            res.status(200).send({ message: 'No hay imagen' })
        }

    })

}


module.exports = {    
    savePublication,
    getPublications,    
    getImageFile
}


