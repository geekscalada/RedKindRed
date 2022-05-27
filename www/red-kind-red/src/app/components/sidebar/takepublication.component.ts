import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { GLOBAL } from "src/app/services/global";
//Modelo publicación
import { Publication } from "src/app/models/publication";
import { PublicationService } from "src/app/services/publications.service";

// Modulo para comprimir imágenes
import imageCompression from 'browser-image-compression';

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
    async onSubmit(form:any) {        
        
        if (!this.activateSubmit) return this.status='error';
        this.activateSubmit = false;
        let formData = new FormData();
        
        
        // console.log('originalFile instanceof Blob', this.filesToUpload[0] instanceof Blob); // true
        // console.log(`originalFile size ${this.filesToUpload[0].size / 1024 / 1024} MB`);
      
        const options = {
          maxSizeMB: 1,          
          useWebWorker: true
        }

        try {
          const compressedFile = await imageCompression(this.filesToUpload[0], options);
        //   console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        //   console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
          formData.append("files", compressedFile, this.filesToUpload[0].name);
                
        } catch (error) {
          console.log(error);
        
        }      
    

        formData.append("publication", JSON.stringify(this.publication))

        return this._publicationService.addPublication(this.token, formData).subscribe(
            response => {
            console.log("respuesta es: ", response)
                if(response){
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
    
        
    }    
    

}