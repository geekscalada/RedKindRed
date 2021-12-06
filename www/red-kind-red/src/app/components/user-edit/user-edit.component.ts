import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { UploadService } from "src/app/services/upload.service";
import {GLOBAL}  from "../../services/global"
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    providers: [UserService, UploadService]
})

export class UserEditComponent implements OnInit {

    public title: string
    public user: User
    public identity:any
    public token:any
    //las comillas las pongo yo
    public status:String = ''
    public url:string

    constructor (

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _http: HttpClient



    ) {

        this.title = ' Actualizar mis datos'
        this.user = this._userService.getIdentity();
        this.identity = this.user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url


    }

    ngOnInit(){
        console.log('user-edit component se ha cargado')
    }

    //# aquí estamos llamando a 2 métodos a la vez, separar
    OnSubmit(form:any){       
        this._userService.updateUser(this.user).subscribe(
            response => {
                
                if(!response.message) {
                    this.status = 'error'
                    throw new Error('No hay usuario en la respuesta')
                    
                } else {
                    this.status = 'success'
                    localStorage.setItem('identity', JSON.stringify(this.user))
                    this.identity = this.user; 

                    let formData = new FormData();
                    
                    for (var i = 0; i < this.filesToUpload.length; i++) {                        
                        formData.append("files", this.filesToUpload[i], this.filesToUpload[i].name);
                    }
                    

                    let headers = new HttpHeaders()
                        .set('Authorization', JSON.stringify(this._userService.getToken()))

                    let identity = this._userService.getIdentity();

                    let userId = identity.id;


                    this._http.post(this.url+'upload-image-user/' + userId, formData, { headers: headers })
                        .subscribe((response: any) => {
                            console.log('response received is ', response);
                        })
                    


                    

                }


            },
            error => {
                let errorMessage = <any>error
                console.log(errorMessage)
                if (errorMessage != null) {
                    return this.status = errorMessage['error']['message']                    
                }

                return this.status = 'Error'
            }
        )
    }

    //la inicializamos, diciéndole que está favía
    public filesToUpload: Array<File> = []

    

    
    fileChangeEvent(fileInput:any){

        this.filesToUpload = <Array<File>>fileInput.target.files;

    }




}




