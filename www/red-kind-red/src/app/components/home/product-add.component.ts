import { Component, NgModule, OnInit } from '@angular/core';
import { base64ToFile, ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { ProductAddModule } from './product-add.module';


import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { UploadService } from "src/app/services/upload.service";
import {GLOBAL}  from "../../services/global"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataService } from "src/app/services/data.service";


@Component({

    selector: 'product-add.component',
    templateUrl: './product-add.component.html',
    providers: [UserService, UploadService]


})
export class ProductAddcomponent implements OnInit {
    
    public imageChangedEvent: any = '';
    public fileToUpload: File | undefined;

    public croppedImage: any = '';


    // adfsdfdsafdfdsafdsfdsafadsf


    public title: string
    public user: User
    public identity:any
    public token:any    
    public status:String = ''
    public url:string
    public filesToUpload: Array<File> = []
    public file: any = ''

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
        this.url = GLOBAL.url    
    }






    uploadFile(event: any) {

        this.imageChangedEvent = event;

        // This going away soon bye bye
        this.fileToUpload = event.target.files[0]
        console.log("this.filetoUpload")
        console.log(this.fileToUpload)
        console.log(this.identity)

    }
    
    imageCropped(event: ImageCroppedEvent) {
        
        //Preview
        this.croppedImage = event.base64; 

        //converting
        const fileBeforeCrop = this.imageChangedEvent.target.files[0]
        //this.fileToUpload = new File( [event.file], fileBeforeCrop.name)       
        

        this.file = new File([base64ToFile(this.croppedImage)], "nombre")
        console.log(this.file)                
        
        console.log(this.croppedImage)
    }

    ngOnInit(): void {
        console.log("Componente cargado")
    }

    updateAvatar() {

        console.log("ejecutando update avatar")
        let userId = this.identity.id;
        let formData = new FormData();



        // for (var i = 0; i < this.filesToUpload.length; i++) {
        //     console.log(this.filesToUpload[i])
        //     formData.append("files", this.filesToUpload[i], this.filesToUpload[i].name);
        // }
        
        formData.append("files", base64ToFile(this.croppedImage), "hola")        
        

        console.log("userId", userId, "formdata", formData)

        return this._userService.uploadAvatar(userId, formData)
            .subscribe(
                (response: any) => {
                this.status = 'success'                
                this.dataService.sendMessage("Mensaje de Avatar cambiado");
                console.log("response", response)
                
            })

        
    }


}