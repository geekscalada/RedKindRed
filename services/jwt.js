'use stric'
var jwt = require('jwt-simple')
var moment = require('moment')

const secretKey = require('../services/secret')

let secret = secretKey.SECRET

//exportamos una función
exports.createToken = function (user) {
    var payload =  {
        id: user.id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        prueba: 'prueba',
        iat: moment().unix(), //tiempo de creación del token
        exp: moment().add(30, 'days').unix
    };
    return jwt.encode(payload, secret)
}

// basicamente vemos que con un payload generamos el hash
// con el método encode se genera un hash gracias al secret, 
// es imposible sin la clave secreta obtener de nuevo el payload que nos da el hash decodificado