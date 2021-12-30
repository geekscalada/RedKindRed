'use stric'

var jwt = require('jwt-simple')
var moment = require('moment')

const secretKey = require('../services/secret')

let secret = secretKey.SECRET


//como solo es una función, lo podemos hacer así
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

// con el método encode se genera un hash gracias al secret, 
// es imposible sin la clave secreta obtener ese hash