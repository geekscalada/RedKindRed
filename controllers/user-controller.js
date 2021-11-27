//#cambiar todo el documento

const bcrypt = require('bcrypt-nodejs')

//seguramente no lo necesitamos
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs')
const path = require('path')

// Services
const jwt = require('../services/jwt');



const Publication = require('../models/publication-model');

// Database and sequelize
const Sequelize = require('sequelize');
const {DataTypes, Association} = require('sequelize')
const sequelize = require('../database.js')


// Models
let User = require('../models/user')(sequelize, Sequelize);
//#cambiar por publication
let Publicationa = require('../models/publication')(sequelize, Sequelize);

// si no importas el modelo
let Key = require('../models/key')(sequelize, Sequelize);

const db = require('../database')
const associations = require('../associations')

User.hasOne(Key, {foreignKey: 'userId'});
Key.belongsTo(User, {foreignKey: 'userId'}); 


//#cambiar por el nuevo
var Follow = require('../models/follow-model')


// 2 metodos de prueba
function home (req, res) {

    res.status(200).send({
        message: 'Pruebas en server'
    })

};

function pruebas (req, res) {

    res.status(200).send({
        message: 'Pruebas en server'
    })

};

//registro
//#cambiar el role_user
//#cambiar BDD para que no admita nulls en ciertos campos
async function saveUser(req, res) {
    
    let params = req.body;

    try {

        if (!params.name || !params.surname || !params.nick || 
        !params.email || !params.password) {

            return res.status(404).send({
                message: 'Falta algún campo'
            })}

        let exists = await User.findOne({
            where: {
                [Sequelize.Op.or]: [{ nick: params.nick.toLowerCase() }, { email: params.email.toLowerCase() }]
            }
        });

        if (exists) { 
            return res.status(404).send({
            message: 'Este usuario ya existe'
        })}
        
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
            role: 'ROLE_USER',
            image: null
        },{
            include: [{ model: Key}]  //, through: 'userId'}]
        })

    let insertUser = await newUser.save();    
    
    newUser.Key.key = undefined;
    console.log(newUser)    
    res.status(200).send({newUser})       
        
    } catch (error) {       
        console.log(error)
        return res.status(404).send({
            message: 'Error en el intento de registro'
        }) 
    }
}  

async function loginUser(req, res) {

        let params = req.body;
        let email = params.email
        let password = params.password

    try {        
        
        const userBDD = await User.findOne(
            {where: {email: email},
            include : {model: Key}
        })        
        if (!userBDD) {throw new Error('No existe este user')} // hacer un return new error    
        
        async function compareAsync(password, userBDD_password) {
            return new Promise(function(resolve, reject) {
                bcrypt.compare(password, userBDD_password, function(err, res) {
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
                {where: {email: email}})  
            
            if (req.body.gettoken) {

                console.log(userInBDD)
                return res.status(200).send({
                    //generamos token                    
                    token: jwt.createToken(userInBDD),
                    user: userInBDD
                 
                })
            } else {
                
                userBDD.password = undefined; //borramos el pass para que no nos lo devuelva por seguridad
                return res.status(200).send({userBDD})
                
            }
        } else {
            console.log("Contra incorrecta")
            return res.status(404).send({                
                message: 'Contraseña incorrecta'
            })
        }
    } catch (error) {        
        console.log(error)        
        return res.status(404).send(
            {message: error.message}
        )   
    }
}

//#cambiar
function getUser(req, res) {
    
    //nos llega un id por la url, por lo tanto usamos params
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'})

        if (!user) return res.status(404).send({message: 'El usuario no existe'});

        // de paso vamos a ver si seguimos o no seguimos a un usuario
        // podemos usar then porque nos devuelve una promesa
        
        followThisUser(req.user.sub, userId).then((value) => {
            
            user.password = undefined;
            
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            })        
        })

       


       // return res.status(200).send({user})

    })
}

//ejemplo de async await para copiar como aprendizaje

//#cambiar con nuevo modelo
async function followThisUser(identity_user_id, user_id) { 

    // este método al usar el async, devuelve una promesa
    
    //original que no funcionaba, fíjate en la sutileza del then
    
    // var followed = await Follow.findOne({"user":user_id, "followed":identity_user_id})
    // .exec((err, follow) => {        
    //     if (err) return handleError(err);
    //     return follow
    // })

    //Modificacion
    let followed = await Follow.findOne({"user":user_id, "followed":identity_user_id})
    .exec()
    .then((follow) => {           
        return follow
    }).catch(
        (err) => { return handleError(err)}
    )


    let following = await Follow.findOne({ "user": identity_user_id, "followed": user_id })
    .exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });    
    
    return {
        following : following,
        followed: followed
    }   
    
}

//devolver listado de usuarios paginados
//#cambiar ¿que hacía este método?

async function getAllUsers(req, res){
    
    try {
        let users = await User.findAll()

    if (!users) {
        throw new Error('Error en la petición')
    }

    return res.status(200).send(
        users
    )
    } catch (error) {

        return res.status(404).send(
            {message: error}
        )
        
    }

    


}

function getUsers(req, res) {

    try {

        if(3<0){throw error}
        
    } catch (error) {
        return "lo rompo para que no moleste"
    }

    // si recuerdas antes hemos bindeado a la request el objeto user
    // que tiene la info decodificada, ahora la usamos 
    // var identity_user_id = req.user.sub; //aquí es donde se almacena el id del usuario

    // var page = 1;
    // if (req.params.page) {
    //     page = req.params.page;
    // }

    // var itemsPerPage = 5; //usuarios por página

    // User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
    // //ordena por id
    //     if (err) return res.status(500).send({message: 'Error en la peticion'})

    //     if (!users) return res.status(404).send({message: 'No hay usuarios disponibles'})


    //     followUsersId(identity_user_id).then((value) => {

    //        return res.status(200).send({
    //             users,
    //             users_following: value.following,
    //             users_followed: value.followed,
    //             total,
    //             pages: Math.ceil(total/itemsPerPage)
    //         })
    //     });    
    // })
}

//#cambiar
async function followUsersId(user_id) {

    // desactivamos campos que no queremos
    let following = await Follow.find({"user":user_id}).select({'_id':0, 'user':0})
    .exec()
    .then((follows) => {


        return follows

    }).catch( (err) => {
        console.log(err)
    })

    let followed = await Follow.find({"followed":user_id}).select({'_id':0, 'followed':0})
    .exec()
    .then((follows) => {        

        return follows

    }).catch( (err) => {
        console.log(err)
    })


    //Procesar following y followed ids

    let following_clean = [];

        following.forEach((follow) => {
            following_clean.push(follow.followed)

        })

        
    let followed_clean = [];

    followed.forEach((follow) => {
        followed_clean.push(follow.user)

    })

    return {
        following: following_clean,
        followed: followed_clean
    }

}

//metodo para contadores
//#cambiar
function getCounters (req, res) {

    // si llega por parametros o si no llega
    let userId = req.user.sub;

    if(req.params.id) {
        userId = req.params.id;
    }


    getCountFollow(userId).then( (value) => {
        return res.status(200).send(value)
    }); 

}

//#cambiar
async function getCountFollow(user_id) {
    var following = await Follow.countDocuments({ user: user_id })
        .exec()
        .then((count) => {
            console.log(count);
            return count;
        })
        .catch((err) => { return handleError(err); });
 
    var followed = await Follow.countDocuments({ followed: user_id })
        .exec()
        .then((count) => {
            return count;
        })
        .catch((err) => { return handleError(err); });

    let publications = await Publication.count({'user' : user_id})
    .exec()
    .then( (count) => {return count})
    .catch((err) => { return handleError(err); });
        
    
 
    return { following: following, followed: followed, publications: publications }
 
}



//edición de datos de usuario
//#cambiar
function updateUser (req, res) {

    var userId = req.params.id;
    
    var update = req.body;

    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para actualizar'})

    }

    // aqui mejoramos el BE para que no nos deje cambiar datos de usuarios
    // si el usuario o el email ya existen
    // lo hacemos algo diferente, a él le da problemas de cabeceras
    // reenviadas (porque usa find en vez de findOne)
    // y tiene que gestionar eso
    User.findOne({
        $or: [
            {email: update.email.toLowerCase()},
            {nick: update.nick.toLowerCase()}
        ]
    }).exec((err, user) => {
        if (user && user._id != userId) return res.status(500).send({message: 'Los datos ya están en uso'})
        
            // el new: true es un param opcional para que el metodo findByandUpdate en vez de 
            // devolvernos el dato nuevo actualizado, por defecto nos da el original
            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
                if(err) return res.status(500).send({message: 'Error en la petición'})

                if(!userUpdated) return res.status(400).send({message: 'No se ha podido actualizar'})

                return res.status(200).send({user: userUpdated})
            }); 

    })


    



}

//subir avatares usuarios
//#cambiar
function uploadImage(req, res) {
    
    var userId = req.params.id;


    // El req.files.iamge.size lo pongo yo
    if(req.files && req.files.image.size != 0){

       

        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');

        var file_name = file_split[(file_split.length)-1] //archivo

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();

        console.log(file_ext)

        if (userId != req.user.sub) {
            // es importante este return y no solo llamar a la funcion, porque si no lo haces
            // no salimos de la función, así que las siguientes instrucciones se ejecutan
            // y te da un error de cabeceras porque se dice que no puedes setear (enviar?)
            // cabeceras de nuevo una vez se han enviado al cliente
            return removeFilesOfUploads(res, file_path,  'No tienes permisos')
        }

        
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' 
        || file_ext == 'gif' ) {

           User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {

            if(err) return res.status(500).send({message: 'Error en la petición'})

            if(!userUpdated) return res.status(400).send({message: 'No se ha podido actualizar'})

             return res.status(200).send({user: userUpdated})

             //esto es exactamente igual que lo que hay antes


           } )

        } else {
            
            // mirar la explicación del otro return parecido a este, creo que este no da
            // tanto problema no ponerlo, pero mejor dejarlo puesto.
           return removeFilesOfUploads(res, file_path, 'Extensión no válida');   

        }
        


    } else {
        return res.status(200).send({message: 'No hay ficheros'})
    }


}

// esta función no hace falta que la exportemos como método, simplemente la usamos
// aquí como parte del método anterior
// importante que tenga la res como parámetro para poder enviar la respuesta
function removeFilesOfUploads (res, file_path, message) {

    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message})
        // No hace falta comprobar if err
    })
    
}

function getImageFile(req, res) {
    
    var image_file = req.params.imageFile;

    var path_file = './uploads/usuarios/'+image_file

    //devuelve un callback exists con una respuesta de si o no
    fs.exists(path_file, (exists) => {

        if(exists){
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(200).send({message: 'No existe ninguna imagen'})
        }

    })

}



module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getAllUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}
