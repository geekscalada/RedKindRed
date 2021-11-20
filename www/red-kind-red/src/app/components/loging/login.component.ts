import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService]
})


export class LoginComponent implements OnInit {

    public title:string;
    public user:User;
    public status:any;

    // propiedad identity llevará el objeto del user identificado
    // token el churro mega string que nos da el jwt
    // con lo que nos autenticamos en la api
    public identity:any;
    public token:any;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Identifícate'
        this.user = new User("","","","","","","ROLE_USER","");        

    }

    onSubmit(form:any){
        this._userService.signUp(this.user, 'true').subscribe(            
            response => {                

                // la response aqui solo te trae el token porque
                // estás en la parte del signUp que solo te trae 
                // el token
                
                this.identity = response.user
                
                if(!this.identity || !this.identity.id){                   
                    
                    this.status = 'error'
                    
                } else {
                    this.status = 'success'
                    
                    // local storage no pueede guardar objetos, solo strings
                    localStorage.setItem('identity', JSON.stringify(this.identity))

                    // conseguir el token
                    this.token = response.token                
                    if(this.token.length <= 0){
                        this.status = 'error'
                    } else {
                        this.status = 'success'
                        
                        // persistir token del usuario
                        console.log("token - >", this.token)
                        localStorage.setItem('token',this.token)


                        // conseguir los contadores o stats
                        this.getCounters();
                    
                    }
                }
            },
            error => {

                var errorMessage = <any>error
                if(errorMessage != null) {
                    this.status = 'error'
                }
            }
        )
    }

    //#cambiar creo que no hace falta
    // el this.token es undefined, tal vez en el 84 funcione
    // getToken(){
    //     this._userService.signUp(this.user, 'true').subscribe(
    //         response => {
                
    //             this.token = response.token                
    //             if(this.token.length <= 0){
    //                 this.status = 'error'
    //             } else {
    //                 this.status = 'success'
                    
    //                 // persistir token del usuario
    //                 localStorage.setItem('token',this.token)


    //                 // conseguir los contadores o stats
    //                 this.getCounters();                  
    //             }       
                

    //         },

    //         error => {

    //             var errorMessage = <any>error
    //             if(errorMessage != null) {
    //                 this.status = 'error'
    //             }

    //         }
    //     )
    // }
    
    ngOnInit(){
        console.log('Componente de login cargado...')
    }

    getCounters(){

        this._userService.getCounters().subscribe(
            response => {
                    
                    localStorage.setItem('stats', JSON.stringify(response))
                    this.status = 'success' 
                    // este status success hace que se puedan quitar el resto,
                    // porque al final todo tiene que pasar por el método counters
                    //#cambiar este navigate
                    this._router.navigate(['/'])    
                                        
                
            },
            error => {
                console.log(error)
            }
        )

    }

}
