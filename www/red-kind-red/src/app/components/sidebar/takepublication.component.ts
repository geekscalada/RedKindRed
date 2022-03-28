import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { GLOBAL } from "src/app/services/global";
//Modelo publicación
import { Publication } from "src/app/models/publication";
import { PublicationService } from "src/app/services/publications.service";

@Component({
    selector: 'takepublication',
    templateUrl: './takepublication.component.html',
    styleUrls: ['../../styles/publication.styles.css'],
    providers: [UserService, PublicationService]
})

export class TakePublicationComponent implements OnInit{

    public identity:any
    public token:string
    public stats:any
    public url:string
    public status:any
    public publication:Publication


    // esto cambiarlo por un over o un debounce

    public activateSubmit:boolean;



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
        this.activateSubmit=true;
    }



    ngOnInit() {
        console.log("Sidebar Cargado")        
    }
    
    //directiva NgModel rellena el formulario con el modelo 
    onSubmit(form:any) {
        
        if (!this.activateSubmit) return this.status='error';

        this.activateSubmit = false;        
        
        let formData = new FormData();
        
        for (var i = 0; i < this.filesToUpload.length; i++) {                        
            console.log(this.filesToUpload[i])
            formData.append("files", this.filesToUpload[i], this.filesToUpload[i].name);
        }

        formData.append("publication", JSON.stringify(this.publication))

        return this._publicationService.addPublication(this.token, formData).subscribe(
            response => {
            console.log("respuesta es: ", response)
                if(response){

                    //al meter form como parámetro, ya no necesitas hacer esto:
                    // this.publication = response.publication
                   
                    this.status = 'success'
                    form.reset();                    
                    return this.activateSubmit = true;
                } else {
                   return this.status = 'error'
                }
            },
            error => {
                console.log(error)
                let errorMessage = <any>error
                return this.status = 'error'
                
            }
        )        
    }

    public filesToUpload: Array<File> = []
    
    fileChangeEvent(fileInput:any){
        
        this.filesToUpload = <Array<File>>fileInput.target.files;   
        
        
      
        //borrar el archivo del formulario. 
        //this.filesToUpload = []
        // Esta línea no tiene efecto, probablemente porque estamos haciendo
        // referencia a este array en el código, habría que hacerlo
        // con splice o bien hacer un getter arriba para no hacer
        // referencia a la propia variable. 
        
    }
    

}