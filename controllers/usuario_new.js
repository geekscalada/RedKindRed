function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;    
    
    User.findOne({email: email}, (err, user) => {
        if (err) return res.status(500).send({
            message: 'Error en la petición'
        })
        
        if (user) {
            bcrypt.compare(password, user.password, (err, check) =>{                
                if (err) return res.status(500).send({
                    message: 'Error en la petición'
                })
                if (check) {                    
                    if (params.gettoken) {
                        //este sería el caso de que en postman le pases un parametro llamado gettoken = true
                            return res.status(200).send({
                            token: jwt.createToken(user) //generamos token
                        })                       

                    } else{
                         //devolvemos los datos del user
                    user.password = undefined; //borramos el pass para que no nos lo devuelva por seguridad
                    return res.status(200).send({user})
                    } 
                } else {
                    return res.status(404).send({
                        message: 'El usuario no se ha podido identificar'
                    })
                }
            })
        } else {
            res.status(404).send({
                message: 'User sin identificar!!!'
            })
        }
    })
}