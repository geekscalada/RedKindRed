// va a ser un middleware que lo que va a hacer es comprobar si un 
// token es correcto o no antes de dejarle pasar al método que 
// nos esté pidiendo el usuario, es decir, antes del controlador



var jwt = require('jwt-simple');
var moment = require('moment');


const secretKey = require('../services/secret')

let secret = secretKey.SECRET


// next es un metodo es lo que nos permite saltar al siguiente metodo


//#cambiar estar funcion
exports.ensureAuth = function(req, res, next){
    

    if(!req.headers.authorization) {
        return res.status(403).send({message: 'La petición no tiene cabecera'})
    }

    var token = req.headers.authorization.replace(/['"]+/g, '')

    try {
        
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()){
            //añadir una redirección???
            return res.status(401).send({message: 'Expirado'})
        }     

        
    } catch(e) {

        return res.status(404).send({message: 'Token No valido'})

    }
    
    //Como extra lo que hacemos es adjuntar el payload a la request
    // para tener siempre en los controladores el objeto del usuario logueado
    
    req.user = payload;

    
    
   
    next(); // saltamos al siguiente paso
    



}

