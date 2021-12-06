'use strict'

// var path = require('path');
// var fs = require('fs')
var mongoosePaginate = require('mongoose-pagination');

//mongoose a secas ya viene con las cosas que vamos a importar

//var User = require('../models/user-model2');
//var Follow = require('../models/follow-model');


function prueba(req, res) {
    res.status(200).send({
        message: 'Hi'
    })
}


function saveFollow(req, res) {
    
    var params = req.body;
    
    var follow = new Follow();

    //esto es porque a la request le añadimos el usuario decodificado (payload)
    // esto lo hacemos en el ensureAuth (el middleware para autenticar)
    follow.user = req.user.sub; //usuario que sigue = usuario identificadp
    follow.followed = params.followed; //usuario seguido es el que vine por la request

    //guardamos
    follow.save( (err, followStored) => {
        if (err) return res.status(500).send({message: 'Error al guardar el follow'});

        if(!followStored) return res.status(404).send({message: 'Error en la peticióin del seguimiento'})

        return res.status(200).send({follow: followStored})
    });

}

function deleteFollow(req, res) {
    
    //ejemplo de params, podría haber otros mal
    let userId = req.user.sub;
    let followId = req.params.id;  

   
    // se podrçia cambiar .remove por el .deleteMany    

    Follow.find({'user' : userId, 'followed' : followId }).remove(
        
        err => {
        
        if (err) return res.status(500).send({message: 'Error al dejar de seguir'})

        return res.status(200).send({message: 'Has dejado de seguirle'})
    } )

}

function getFollowingUsers(req, res) {

    let userId = req.user.sub;

    //daremos un listado u otro en función de que nos llegue un id por url o no nos llegue

    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    let page = 1;

    if (req.params.page) {
        page = req.params.page;      
    } else {
        page = req.params.id //para cuando solo pongamos un parámeto, que lo detectemos como pagina en vez de como user
    }

    let itemsPerPage = 4;

    // aqui populamos, es decir, en el campo followed, lo que queremos hacer
    // es cambiarla por el documento que hace referencia a ese objectID
    // de manera que tendríamos todo el objeto completo

    Follow.find({user:userId}).populate({path: 'followed'}).paginate(
         page, itemsPerPage, (err, follows, total) => {
            if (err) return res.status(500).send({message: 'Error al dejar de seguir'})

            if(!follows) return res.status(404).send({message: 'No sigues a ningún usuario'})

            return res.status(200).send({
                total: total, //total de documentos que nos devuelve el find
                pages: Math.ceil(total/itemsPerPage),
                follows //ya te crea la propiedad

            })
        }
    ) 

    
}

function getFollowedUsers(req, res) {

    let userId = req.user.sub;

    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    let page = 1;

    if (req.params.page) {
        page = req.params.page;      
    } else {
        page = req.params.id;
    }

    let itemsPerPage = 4;

    //aquí cambiamos y lo que buscamos es el followed, es decir que somos nosotros
    // el usuario al que siguen

    Follow.find({followed:userId}).populate('followed').paginate(
         page, itemsPerPage, (err, follows, total) => {
            if (err) return res.status(500).send({message: 'Error al dejar de seguir'})

            if(!follows) return res.status(404).send({message: 'No te ningún usuario'})

            return res.status(200).send({
                total: total, //total de documentos que nos devuelve el find
                pages: Math.ceil(total/itemsPerPage),
                follows //ya te crea la propiedad

            })
        }
    ) 

    
}

// Devolver usuarios que sigo o que me siguen

function getMyfollows(req, res) {

    // lo hacemos en función de si recibimos por url parámetros o no
    let userId = req.user.sub;

    let find = Follow.find({user: userId})

    if(req.params.followed){
        find = Follow.find({followed: userId})
    }

    // populamos ambos
    find.populate('user followed').exec((err, follows) =>  {
        if (err) return res.status(500).send({message: 'Error al dejar de seguir'})
        
        if(!follows) return res.status(404).send({message: 'No te ningún usuario'})

        return res.status(200).send({
            follows
        })

    });
    
}




module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyfollows
}












