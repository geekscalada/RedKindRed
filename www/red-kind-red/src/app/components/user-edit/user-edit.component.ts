import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { UploadService } from "src/app/services/upload.service";
import {GLOBAL}  from "../../services/global"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataService } from "src/app/services/data.service";


@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['../../styles/updatedata.styles.css'],
    providers: [UserService, UploadService]
})

export class UserEditComponent implements OnInit {

    public title: string
    public user: User
    public identity:any
    public token:any    
    public status:String = ''
    public url:string

    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _http: HttpClient,
        private dataService: DataService
    ) {
        this.title = ' Actualizar mis datos'
        this.identity = this._userService.getIdentity();
        this.user = this._userService.getIdentity();        
        this.token = this._userService.getToken();
        this.url = GLOBAL.url    }

    

    ngOnInit(){
        console.log('user-edit component se ha cargado')   

    }
    //###CAMBIAR
    // mejorar un poco los métodos a nivel parámetros
    OnSubmit(form:any){        
        let userId = this.identity.id;        
        if (this.user.nick == this.identity.nick && 
            this.user.email == this.identity.email) {
            
           return this.updateAvatar();

        }       
        
        return this._userService.updateUser(this.user).subscribe(                
            response => {
                if(!response.message) {
                    this.status = 'error'
                    throw new Error('No hay usuario en la respuesta')
                    
                } else {
                    this.status = 'success'
                    localStorage.setItem('identity', JSON.stringify(this.user))
                    this.identity = this.user;
                    this.updateAvatar();
                }
            },
            error => {
                let errorMessage = <any>error                
                if (errorMessage != null) {                                       
                    return this.status = errorMessage['error']['message']                    
                }
                return this.status = 'error'
            }
        )
    }

    updateAvatar() {
        let userId = this.identity.id;
        let formData = new FormData();

        for (var i = 0; i < this.filesToUpload.length; i++) {
            formData.append("files", this.filesToUpload[i], this.filesToUpload[i].name);
        }        

        return this._userService.uploadAvatar(userId, formData)
            .subscribe(
                (response: any) => {
                this.status = 'success'                
                this.dataService.sendMessage("Mensaje de Avatar cambiado");
                
            })
    }

    //la inicializamos vacía
    public filesToUpload: Array<File> = []
    
    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    


}




