'use strict'
// trabajaremos con este modelo como si fuera algo individual xq trabajaremos con una publicación no con conjuntos de publicaciones

var mongoose = require('mongoose')
var Schema = mongoose.Schema; //nos carga mongoose.schema que nos permitirá definir esquemas

//le pasamos un json
var followSchema = Schema({

    //id no hace falta porque es automatico
    user: { type: Schema.ObjectId, ref: 'User' },
    followed: {type: Schema.ObjectId, ref: 'User'}
    
    
    // aquí le decimos que el usuario es un tipo objectId y que hace referencia al esquema 'User'
})
// ya tendríamos definido el esquema de este modelo por lo tanto podremos crear objetos en base a
// este modelo

module.exports = mongoose.model('Follow', followSchema) //la colección que se guardará en la base de datos
// sera 'users' es decir lo pluraliza y le hace un lower
//basicamente le estamos diciendo que hay un modelo que se llamará user y que usa el esquema UserSchema




