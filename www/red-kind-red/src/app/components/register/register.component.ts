import {Component, OnInit} from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router';
// importamos el servicio UserService también
import { UserService } from 'src/app/services/user.service';
// importamos los modelos que necesitemos
import { User } from 'src/app/models/user';

import { FormControl } from '@angular/forms';

//en la propiedad providers cargamos servicios
@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['../../styles/register.styles.css'],
    providers: [UserService]
})

export class RegisterComponent implements OnInit {

    public title:string;
    public user: User;
    public status:any; 

    constructor(

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,

    ){
        this.title = 'Regístrate'
        this.user = new User("","","","","","","")
    }

    ngOnInit(){
        console.log('Componente de register cargado...')
    }

    // es un método que lo que hará es recoger los datos
    // desde el componente cuando rellenemos el formulario
    // los datos se bindean con el modelo User gracias a la directiva NgModel    
    registerFormSubmit(registerForm:any){        
        this._userService.register(this.user).subscribe(
            (response)=>{
                if(response.newUser && response.newUser.id) {                   
                    //esto lo usaremos en las alertas del componente a nivel de html
                    this.status = "success"
                    this.user = response.newUser;
                    //console.log(response.newUser)
                    //reseteamos el registro
                    return registerForm.reset();
                }
                this.status = "Ha habido algún error en la petición"                
            },
            (error)=>{                
                console.log(<any>error)
                this.status = error.error.message
            }
        )
    }

}
