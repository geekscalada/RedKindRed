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


// const User = require('../models/user-model2')
// const Follow = require('../models/follow-model')

function probando(req, res) {
    res.status(200).send({ message: "metodo probando" })
}

//#cambiamos al nuevo
async function savePublication(req, res) {

    try {
        let params = req.body;
        console.log(req)

        //#cambiar por un throw
        if (!params.text) return res.status(200).send({ message: 'Por favor, envia todos los campos' })

        let newPublication = await Publication.build({

            text: params.text,
            surname: req.user.surname,
            file: params.file,
            userID: req.user.id

        })

        let insertPublication = await newPublication.save();


    } catch (error) {
        console.log(error)
        return res.status(404).send({
            message: 'Error al publicar'
        })
    }

}

//#cambiado
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

//#cambiar
//console.log("de momento lo rompo para que no moleste")

// let page = (function(){

//     if(req.params.page){
//         return req.params.page
//     } else {
//         return "1"
//     }

// })();

// let itemsPerPage = 4;

// console.log("req.user" ,req.user)

// Follow.find({"user": req.user.sub}).populate('followed').exec()
// .then((follows) => {

//     let follows_clean = []

//     follows.forEach((follow) => {
//         follows_clean.push(follow.followed)
//     })       

//     //añadimos nuestras publicaciones para que nos aparezcan en el timeline
//     follows_clean.push(req.user.sub)


//     // va a buscar dentro del array de follows clean, de esta manera nos
//     // sacará las publicaciones de usuarios a los que seguimos
//     Publication.find({user: {"$in": follows_clean}}).sort('-created_at')
//     .populate('user').paginate(page, itemsPerPage, (err, publications, total) => {

//         if(err) return res.status(500).send({message: 'Error al guardar la publicacion'})

//         if(!publications) return res.status(404).send({message: 'No hay publicaciones'})

//         return res.status(200).send({
//             total_items: total,
//             pages: Math.ceil(total/itemsPerPage),
//             publications,
//             page: page
//         })



//     })


// }).catch((err) => {
//     if(err) return res.status(500).send({message: err})
// })







// publicaciones por ID
//#cambiar  probablemetne  no hace falta
function getPublication(req, res) {

    let publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {

        if (err) return res.status(500).send({ message: 'Error al buscar la publicacion' })

        if (!publication) return res.status(404).send({ message: 'La publicación no existe' })

        return res.status(200).send({ publication })


    })

}

// borrar publicacion
//#cambiar


function deletePublication(req, res) {

    let publicationId = req.params.id;


    // hay un metodo que hace remove automaticamente, pero cuidado, porque
    // preferimos hacerlo de otra manera para que podamos comprobar que la publicación
    // es nuestra (y por lo tanto somos los que podemos borrarla)
    // ojo que le añado el _ en el id porque de lo contrario nos borra todas las publis

    // #### ojo, borra publicaciones de otros usuarios...la autentificacion se la pasa por el forro

    Publication.find({ "user": req.user.sub, "_id": publicationId })
        .remove((err) => {

            if (err) return res.status(500).send({ message: 'Error al buscar la publicacion' })

            return res.status(200).send({ message: "Publicacion eliminada correctamente" })


        })


}

//subir imagenes usuarios

function uploadImage(req, res) {

    var publicationId = req.params.id;

    // El req.files.iamge.size lo pongo yo
    if (req.files && req.files.image.size != 0) {

        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');

        var file_name = file_split[(file_split.length) - 1] //archivo

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();



        //añadimos una validación que nos diga si la publicación es nuestra o no

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg'
            || file_ext == 'gif') {

            Publication.findOne({ 'user': req.user.sub, '_id': publicationId }).exec(

                (err, publication) => {

                    if (err) return res.status(500).send({ message: 'Error al buscar la publicacion' })


                    if (publication) {

                        //actualizamos
                        Publication.findByIdAndUpdate(publicationId, { file: file_name }, { new: true }, (err, publicationUpdated) => {

                            if (err) return res.status(500).send({ message: 'Error en la petición' })

                            if (!publicationUpdated) return res.status(400).send({ message: 'No se ha podido actualizar' })

                            return res.status(200).send({ publication: publicationUpdated })

                        })

                    } else {

                        return removeFilesOfUploads(res, file_path, 'No tiens permisos para publicar');

                    }
                })


        } else {

            return removeFilesOfUploads(res, file_path, 'Extensión no válida');

        }



    } else {
        return res.status(200).send({ message: 'No hay ficheros' })
    }


}

// esta función no hace falta que la exportemos como método, simplemente la usamos
// aquí como parte del método anterior
// importante que tenga la res como parámetro para poder enviar la respuesta
function removeFilesOfUploads(res, file_path, message) {

    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message })
        // No hace falta comprobar if err
    })

}

function getImageFile(req, res) {

    var image_file = req.params.imageFile;

    var path_file = './uploads/publicaciones/' + image_file

    //devuelve un callback exists con una respuesta de si o no
    fs.exists(path_file, (exists) => {

        if (exists) {
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(200).send({ message: 'No existe ninguna imagen' })
        }

    })

}


module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}


