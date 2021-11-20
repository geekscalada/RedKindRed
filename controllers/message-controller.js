
let moment = require('moment')
let mongoosePaginate = require('mongoose-pagination');


// let User = require('../models/user-model2');
// let Follow = require('../models/follow-model');
// let Message = require('../models/messaje-model')


function pruebaMensaje(req, res) {
    res.status(200).send({
        message: 'Hi'
    })
}

function saveMessage(req, res) {
    let params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message: 'Envía todos los datos necesarios'})

    let message = new Message();

    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false'

    message.save((err, messageStored) => {

        if(err) return res.status(500).send({message: 'Error en la petición'})        
        if(!messageStored) return res.status(404).send({message: 'Error al enviar el mensaje'})        

        return res.status(200).send({message: messageStored})

    })
}

function getReceivedMessages(req, res){

    var userId = req.user.sub;

    var page = 1;

    if (req.params.page){
        page = req.params.page;
    }

    let itemsPerPage = 4;

    // en este populate le decimos que nos popule el emitter pero solo nos tire los campos
    //name, surname, id, etc...
    Message.find({receiver: userId}).populate('emitter', 'name surname nick image _id' ).paginate(
        page, itemsPerPage, (err, messages, total) => {

            if(err) return res.status(500).send({message: 'Error en la petición'})        
            if(!messages) return res.status(404).send({message: 'No hay mensajes'})
            
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                messages
            })
        })
}

function getEmitMessages(req, res){

    var userId = req.user.sub;

    var page = 1;

    if (req.params.page){
        page = req.params.page;
    }

    let itemsPerPage = 4;

    Message.find({emitter: userId}).populate('emitter receiver', 'name surname nick image _id' ).paginate(
        page, itemsPerPage, (err, messages, total) => {

            if(err) return res.status(500).send({message: 'Error en la petición'})        
            if(!messages) return res.status(404).send({message: 'No hay mensajes'})
            
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                messages
            })
        })
}

function getUnviewedMessages (req, res) {

    let userId = req.user.sub;

    Message.count({receiver: userId, viewed:'false'}).exec()
    .then( (count) => {

        //if(err) return res.status(500).send({message: 'Error en la petición'})        

        return res.status(200).send({
            'unviewed': count 
        })

    }).catch( (err) => {console.log(err)})

}

// torna a los mensajes no leídos como leídos
function setViewedMessages(req, res) {
    
    let userId = req.user.sub;
    // viewed true -> es para decirle que cambiamos esto
    // multi true es actualizar todos los docs, no solo 1
    Message.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {'multi': true}, (err, messagesUpdated) => {

        if(err) return res.status(500).send({message: 'Error en la petición'})        

        return res.status(200).send({
            messages: messagesUpdated
        })
        

    })


}

module.exports = {
    pruebaMensaje,
    saveMessage,
    getReceivedMessages,
    getEmitMessages,
    getUnviewedMessages,
    setViewedMessages
}












