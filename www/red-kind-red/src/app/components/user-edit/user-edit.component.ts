import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { UploadService } from "src/app/services/upload.service";
import {GLOBAL}  from "../../services/global"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataService } from "src/app/services/data.service";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';



import { base64ToFile, ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

// Aquí no es necesario trabajar con un múdulo que nos traiga el
// cropper porque vamos a inyectarlo directamente en el mismo
// componente, no vamos a usar 2 componentes (?)
//import { ProductAddModule } from '../home/product-add.module';

@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['../../styles/updatedata.styles.css'],
    providers: [UserService, UploadService, NgbModal] 
})

export class UserEditComponent implements OnInit {

    public title: string
    public user: User
    public identity:any
    public token:any    
    public status:String = ''
    public url:string


    public imageChangedEvent: any = '';
    public croppedImage: any = ''; 
    



    constructor (
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _http: HttpClient,
        private dataService: DataService,
        private _modalService: NgbModal 
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

    changeFile(event: any) {

        this.imageChangedEvent = event;
           

    }
    
    imageCropped(event: ImageCroppedEvent) {        
        //Preview
        this.croppedImage = event.base64;
    }

    updateAvatar() {
        console.log("ejecutando update avatar")
        let userId = this.identity.id;
        let formData = new FormData();
        
        
        formData.append("files", base64ToFile(this.croppedImage),
        this.imageChangedEvent.target.files[0].name) 
        
        console.log(this.imageChangedEvent.target.files[0].name)

        return this._userService.uploadAvatar(userId, formData)
            .subscribe(
                (response: any) => {
                this.status = 'success'                
                this.dataService.sendMessage("Mensaje de Avatar cambiado");
                console.log("response", response)                
        })       
            
        
    }

    openModal(content :any) {        
        this._modalService.open(content);
    }


    borrar() {
        this.croppedImage = '';
        this._modalService.dismissAll(); //cerrar modal
    }
    

    


}




