// este ees un componente que vamos a poder usar en cualquier parte de nuestra web

import { Component, OnInit } from "@angular/core";

import { UserService } from "src/app/services/user.service";
import { GLOBAL } from "src/app/services/global";
import { Publication } from "src/app/models/publication";
import { PublicationService } from "src/app/services/publications.service";

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers: [UserService, PublicationService]
})

export class SidebarComponent implements OnInit{

    public identity:any
    public token:string
    public stats:any
    public url:string
    public status:any
    public publication:Publication

    constructor (

        private _userService: UserService,
        private _publicationService: PublicationService



    ) {

        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();       
        this.url = GLOBAL.url
        this.publication = new Publication(
          "",
          this.identity.surname,
          "",
            this.identity.id,
          ""  
        )
    }

    ngOnInit() {
        console.log("Sidebar Cargado")        
    }

    // aunque no es necesario, te traes el formulario como parámetro
    // de esta manera puedes resetearlo
    onSubmit(form:any) {
        //publication ya va relleno a través del formulario
        
        console.log(this.publication)        

        let formData = new FormData();
        
        for (var i = 0; i < this.filesToUpload.length; i++) {                        
            console.log(this.filesToUpload[i])
            formData.append("files", this.filesToUpload[i], this.filesToUpload[i].name);
        }
        
        formData.append("publication", JSON.stringify(this.publication))
        
        
        this._publicationService.addPublication(this.token, formData).subscribe(
            response => {
            console.log("respuesta es: ", response)
                if(response){

                    //al meter form como parámetro, ya no necesitas hacer esto:
                    // this.publication = response.publication
                   
                    this.status = 'success'
                    form.reset();
                } else {
                    this.status = 'error'
                }
            },
            error => {
                console.log(error)
                let errorMessage = <any>error
                if(errorMessage != null) {
                    this.status = 'error'
                }
            }
        )        
    }
    
    public filesToUpload: Array<File> = []    

    
    fileChangeEvent(fileInput:any){

        this.filesToUpload = <Array<File>>fileInput.target.files;

    }


}