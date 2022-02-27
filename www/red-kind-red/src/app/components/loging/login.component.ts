import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['../../styles/login.styles.css'],
    providers: [UserService]
})

export class LoginComponent implements OnInit {

    public title:string;
    public user:User;
    public status:any;
    // propiedad identity llevará el objeto del user identificado    
    public identity:any;
    //token jwt que nos trae la api
    public token:any;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Acceder'
        this.user = new User("","","","","","","","");     

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
                        this._router.navigate(['/amigos'])
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
    
    ngOnInit(){
        console.log('Componente de login cargado...')
    }

}
