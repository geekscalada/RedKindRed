import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { UploadService } from "src/app/services/upload.service";
import {GLOBAL}  from "../../services/global"

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
        private _userServive: UserService,
        private _uploadService: UploadService



    ) {

        this.title = ' Actualizar mis datos'
        this.user = this._userServive.getIdentity();
        this.identity = this.user;
        this.token = this._userServive.getToken();
        this.url = GLOBAL.url


    }

    ngOnInit(){
        console.log('user-edit component se ha cargago', this.user)
    }

    OnSubmit(form:any){

        //form no lo estamos usando aqui

        console.log(this.user)

        this._userServive.updateUser(this.user).subscribe(
            response => {

                if(!response.user) {
                    this.status = 'error'
                    
                } else {
                    this.status = 'success'
                    localStorage.setItem('identity', JSON.stringify(this.user))
                    this.identity = this.user; //actualizamos a nivel de clase

                    //subida de imagen de usuario
                    this._uploadService.makeFilerequest(this.url+'upload-image-user/'+this.user._id, [],
                    this.filesToUpload, this.token, 'image')
                    .then((result:any) => {
                        console.log(result)
                        this.user.image = result.user.image
                        localStorage.setItem('identity', JSON.stringify(this.user) )

                    })
                    .catch((err) => {
                        console.log(err)
                    })

                }


            },
            error => {
                let errorMessage = <any>error
                console.log(errorMessage)

                if (errorMessage != null) {

                    this.status = 'error'
                    
                }
            }
        )
    }

    //la inicializamos, diciéndole que está favía
    public filesToUpload: Array<File> = []

    
    fileChangeEvent(fileInput:any){

        this.filesToUpload = <Array<File>>fileInput.target.files;

    }




}

