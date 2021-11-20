var express = require('express')

var FollowController = require('../controllers/follow-controller')
var api = express.Router();
var middleware_auth = require('../middlewares/auth')

api.get('/pruebaFollowed', middleware_auth.ensureAuth ,FollowController.prueba)
api.post('/follow', middleware_auth.ensureAuth, FollowController.saveFollow)
api.delete('/follow/:id', middleware_auth.ensureAuth, FollowController.deleteFollow)
api.get('/following/:id?/:page?', middleware_auth.ensureAuth, FollowController.getFollowingUsers)
api.get('/followed/:id?/:page?', middleware_auth.ensureAuth, FollowController.getFollowedUsers)
api.get('/get-my-follows/:followed?', middleware_auth.ensureAuth, FollowController.getMyfollows)


//#cambiar el nombre de esta variable
module.exports = api;

