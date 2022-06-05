//#auth
const jwtsimple = require('jwt-simple');
const moment = require('moment');
const secretKey = require('../services/secret')
const secret = secretKey.SECRET

exports.jwtAuth = function(req, res, next){    

    if(!req.headers.authorization) {
        return res.status(403).send({message: 'Petición sin cabecera'})
    }
    let token = req.headers.authorization.replace(/['"]+/g, '')

    console.log("my token", token);

    try {        
        var payload = jwtsimple.decode(token, secret);
        if (payload.exp <= moment().unix()){            
            return res.status(401).send({message: 'Expirado'})
        }


    } catch(e) {
        return res.status(404).send({message: 'Token fallado'})
    }
    // Adjuntamos  el payload a la request
    // para tener siempre en los controladores el objeto del usuario logueado
    req.user = payload;
    // next es un metodo es lo que nos permite saltar al siguiente metodo
    // en esta arquitectura es un controlador u otro middleware siempre
    next();
}

