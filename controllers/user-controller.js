//userController

const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const path = require('path')

// Services
const jwt = require('../services/jwt');
const pvKey = require('../services/secret')

// Database and sequelize
const Sequelize = require('sequelize');
const { DataTypes, Association } = require('sequelize')
const sequelize = require('../config/database.js')
const db = require('../config/database')
const associations = require('../associations')

// Models
let User = require('../models/user')(sequelize, Sequelize);
let Publication = require('../models/publication')(sequelize, Sequelize);
let Key = require('../models/key')(sequelize, Sequelize);
let Friend = require('../models/friend')(sequelize, Sequelize)

//Associations 
User.hasOne(Key, { foreignKey: 'userId' });
Key.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Friend, { foreignKey: 'IDtarget' })
Friend.belongsTo(User, { foreignKey: 'IDtarget' })


module.exports = class userController {
    //registro
    static async saveUser(req, res) {
        let params = req.body;
        
        try {
            if (!params.name || !params.surname || !params.nick ||
                !params.email || !params.password || !params.pvKey) {

                return res.status(404).send({
                    message: 'Falta algún campo'
                })
            }   

            if (params.pvKey != pvKey.pvKey){
                return res.status(404).send({
                    message: 'La clave no es correcta'
                })
            }

            let exists = await User.findOne({
                where: {
                    [Sequelize.Op.or]: [{ nick: params.nick.toLowerCase() }, { email: params.email.toLowerCase() }]
                }
            });
            
            if (exists) {
                return res.status(404).send({
                    message: 'Este usuario ya existe'
                })
            }

            let salt = bcrypt.genSaltSync(8)
            let hashPass = bcrypt.hashSync(params.password, salt)

            let newUser = await User.build({
                name: params.name,
                surname: params.surname,
                nick: params.nick.toLowerCase(),
                email: params.email.toLowerCase(),
                Key: {
                    key: hashPass
                },
                image: null
            }, {
                include: [{ model: Key }]  //, through: 'userId'}]
            })

            let insertUser = await newUser.save();

            newUser.Key.key = undefined;
            res.status(200).send({ newUser })

        } catch (error) {
            return res.status(404).send({
                message: 'Error en el intento de registro'
            })
        }
    }

    static async loginUser(req, res) {
        

        let params = req.body;
        let email = params.email
        let password = params.password

        try {

            const userBDD = await User.findOne(
                {
                    where: { email: email },
                    include: { model: Key }
                })
            if (!userBDD) { throw new Error('No existe este user') } // hacer un return new error    

            async function compareAsync(password, userBDD_password) {
                return new Promise(function (resolve, reject) {
                    bcrypt.compare(password, userBDD_password, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    });
                });
            }

            let userBDDpass = userBDD['Key']['key']

            const checkPass = await compareAsync(password, userBDDpass)

            if (checkPass) {

                const userInBDD = await User.findOne(
                    { where: { email: email } })

                if (req.body.gettoken) {

                    return res.status(200).send({
                        //generamos token                    
                        token: jwt.createToken(userInBDD),
                        user: userInBDD

                    })
                } else {

                    userBDD.password = undefined; //borramos el pass para que no nos lo devuelva por seguridad
                    return res.status(200).send({ userBDD })

                }
            } else {
                return res.status(404).send({
                    message: 'Contraseña incorrecta'
                })
            }
        } catch (error) {
            return res.status(404).send(
                { message: error.message }
            )
        }
    }


    static async getAllUsers(req, res) {

        try {

            let users = await User.findAll(
                { include: { model: Friend, required: false, left: true } }
            )

            if (!users) {
                throw new Error('Error en la petición')
            }

            return res.status(200).send(
                users
            )
        } catch (error) {

            return res.status(404).send(
                { message: error }
            )
        }
    }

    static async sendRequestToFriend(req, res) {

        try {


            let toAccept = await Friend.findAll({
                where: {
                    'IDtarget': req.user.id,
                    'IDfriend': req.body.IDtarget,
                    'status': 'received'
                }
            })


            if (toAccept[0]) {

                //aceptamos invitación
                await Friend.update({
                    'status': 'accepted'

                }, {
                    where: {
                        'IDtarget': req.user.id,
                        'IDfriend': req.body.IDtarget
                    }
                })

                //creamos linea en el lado inverso
                await Friend.create({

                    'IDtarget': req.body.IDtarget,
                    'IDfriend': req.user.id.toString(),
                    'status': 'accepted'
                })

                return res.status(200).send(
                    { message: 'Dato insertado correctamente' }
                )
            }

            let exists = await Friend.findAll({
                where: {
                    'IDtarget': req.body.IDtarget,
                    'IDfriend': req.user.id.toString(),
                    'status': 'received'
                }
            })

            if (exists[0]) { return new Error('Este usuario ya está solicitado') }


            let newRequestTofriend = await Friend.build({
                IDtarget: req.body.IDtarget,
                IDfriend: req.user.id,
                status: 'received'
            })

            await newRequestTofriend.save();

            return res.status(200).send(
                { message: 'Dato insertado correctamente' }
            )


        } catch (error) {
            console.log(error)
        }
    }

    static async getFriends(req, res) {

        try {
            let friends = await Friend.findAll(
                {
                    atributes: ['id'], where: { 'IDtarget': req.user.id.toString(), 'status': 'accepted' }
                })



            let arrFriends = []

            for (let idFriend in friends) {
                arrFriends.push(
                    friends[idFriend]['IDfriend']
                )
            }

            return res.status(200).send(
                arrFriends
            )



            //console.log(friends[0]['dataValues'])//['Friend'])//['id'])
        } catch (error) {
            console.log(error)
        }
    }

    static async getMyReqFriends(req, res) {

        try {
            
            let friends = await Friend.findAll(
                {
                    atributes: ['id'], where: { 'IDtarget': req.user.id.toString(), 'status': 'received' }
                })

            let arrFriends = []

            for (let idFriend in friends) {
                arrFriends.push(
                    friends[idFriend]['IDfriend']
                )
            }

            return res.status(200).send(
                arrFriends
            )

            //console.log(friends[0]['dataValues'])//['Friend'])//['id'])
        } catch (error) {
            console.log(error)
        }
    }

    static async getMyOwnReqFriends(req, res) {

        try {
            let friends = await Friend.findAll(
                {
                    atributes: ['id'], where: { 'IDfriend': req.user.id.toString(), 'status': 'received' }
                })
            
            let arrFriends = []

            for (let idFriend in friends) {
                arrFriends.push(
                    friends[idFriend]['IDtarget']
                )
            }

            return res.status(200).send(
                arrFriends
            )

            //console.log(friends[0]['dataValues'])//['Friend'])//['id'])
        } catch (error) {
            console.log(error)
        }
    }

    static async updateUser(req, res) {

        try {

            let userId = req.user.id;
            let update = req.body;

            if (userId != update.id) {
                return res.status(500).send({
                    message: 'No tienes permisos para actualizar'
                })
            }

            let existsMail = false
            let existsNick = false

            if (req.user.nick != req.body.nick){

                existsNick = await User.findOne({
                    where: {
                        nick: update.nick.toLowerCase() 
                    }
                });

            }           


            if (req.user.email != req.body.email){                
                existsMail = await User.findOne({
                    where: {
                        email: update.email.toLowerCase() 
                    }
                });

            }

            if (existsNick || existsMail) {
                return res.status(500).send({
                    message: 'Este email o nick ya existen'
                })
            }

            await User.update({
                'name': update.name,
                'surname': update.surname,
                'nick': update.nick,
                'email': update.email
            }, {
                where: { 'id': userId }
            })
            return res.status(200).send({
                message: 'Datos actualizados'

            })
        } catch (error) {
            console.log(error)
        }
    }


    static async uploadImage(req, res) {


        let userId = req.user.id

        // El req.files.iamge.size lo pongo yo
        if (req.files) {

            let path = req.files.files.path;
            let fileSplit = path.split('\/');

            let fileName = fileSplit[(fileSplit.length) - 1] //archivo       
            

            try {
                await User.update({
                    'image': fileName

                }, {
                    where: { 'id': userId }
                })

                return res.status(200).send({ message: 'Avatar actualizazado' })

            } catch (error) {

                return res.status(400).send({ message: 'No se ha podido actualizar ' + error })

            }


        } else {
            return res.status(200).send({ message: 'No hay ficheros' })
        }


    }

    // No implementada
    static removeFiles(res, path, message) {

        fs.unlink(path, (err) => {
            return res.status(200).send({ message: message })
        })

    }

    static async getIdentityFromDB(req, res){


        let email = req.body.email

        const userInBDD = await User.findOne(
             { where: { email: email } })

        return res.status(200).send({ userInBDD })
    }


    static async getImageFile(req, res) {


        let image = req.params.imageFile;
        let mypath = './uploads/usuarios/' + image

        //devuelve un callback exists con una respuesta de si o no
        fs.exists(mypath, (exists) => {

            if (exists) {
                res.sendFile(path.resolve(mypath))
            } else {
                res.status(200).send({ message: 'No hay imagen' })
            }
        })

    }
}
