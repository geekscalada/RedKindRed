
let express = require('express')

let MessageController = require('../controllers/message-controller')
let api = express.Router();
let middleware_auth = require('../middlewares/auth')

api.get('/pruebamensaje', MessageController.pruebaMensaje)
api.post('/message', middleware_auth.ensureAuth ,MessageController.saveMessage)
api.get('/my-messages/:page?', middleware_auth.ensureAuth , MessageController.getReceivedMessages)
api.get('/messages/:page?', middleware_auth.ensureAuth , MessageController.getEmitMessages)
api.get('/unviewed-messages', middleware_auth.ensureAuth , MessageController.getUnviewedMessages)
api.get('/set-viewed-messages', middleware_auth.ensureAuth , MessageController.setViewedMessages)

module.exports = api;

