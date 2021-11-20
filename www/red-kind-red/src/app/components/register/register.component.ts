import {Component, OnInit} from '@angular/core'

import { Router, ActivatedRoute, Params } from '@angular/router';

// importamos el servicio UserService, tambiçen
// tenemos que usarlo en el constructor
import { UserService } from 'src/app/services/user.service';

// importamos los modelos que necesitemos

import { User } from 'src/app/models/user';
import { FormControl } from '@angular/forms';

//en la propiedad providers cargamos servicios
@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers: [UserService]
})


export class RegisterComponent implements OnInit {

    public title:string;

    // para el formulario usaremos el objeto User
    public user: User;

    public status:any; //tengo que dejar any porque no me deja string

    
    constructor(

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        
        

    ){
        this.title = 'Registrate'
        this.user = new User("","","","","","","ROLE_USER","")
    }

    ngOnInit(){
        console.log('Componente de register cargado...')
    }

    // este es un método que lo que hará es recoger los datos
    // desde el componente cuando rellenemos el formulario 
    
    onSubmit(registerForm:any){

         /* Muy interesante. ¿Que nos devuelve el método register (servicio)? Un observable.
         Un observable hace que te puedas suscribir a él y usar sus callbacks, de esta manera podemos
         escuchar lo que devuelva la API
         
         ¿Qué devuelve la API?
         Pues una respuesta o un error        
         
         */
        this._userService.register(this.user).subscribe(

            response => {

                if(response.user && response.user._id) {                   
                    //esto lo usaremos en las alertas del componente a nivel de html
                    this.status = "success"
                    //reseteamos el registro
                    registerForm.reset();

                } else {
                    this.status = "error"
                }

            },

            error => {console.log(<any>error)}


        );

    }

}
