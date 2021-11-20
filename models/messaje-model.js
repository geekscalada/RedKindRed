'use strict'
// trabajaremos con este modelo como si fuera algo individual xq trabajaremos con una publicación no con conjuntos de publicaciones

var mongoose = require('mongoose')
var Schema = mongoose.Schema; //nos carga mongoose.schema que nos permitirá definir esquemas

//le pasamos un json
var messageSchema = Schema({

    text: String,
    viewed: String, //podría ser booleano
    created_at: String,
    emitter: { type: Schema.ObjectId, ref: 'User' },
    receiver: { type: Schema.ObjectId, ref: 'User' },
    
})


module.exports = mongoose.model('Message', messageSchema) //la colección que se guardará en la base de datos
// sera 'users' es decir lo pluraliza y le hace un lower
//basicamente le estamos diciendo que hay un modelo que se llamará user y que usa el esquema UserSchema

