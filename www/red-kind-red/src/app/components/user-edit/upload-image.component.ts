import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserService } from 'src/app/services/user.service';

@Component({
   selector: 'myfileupload',
   templateUrl: './upload-image.component.html'
})
export class UploadPageComponent implements OnInit {
    
    public archivos: any = []
    
    

    constructor(
        public _http: HttpClient,
        public _userService: UserService
    ) {
        
    }

    ngOnInit(): void {

    }

    capturarFile(event:any): any{
        const archivoCapturado = event.target.files[0]
        this.archivos.push(archivoCapturado)

    }

    subirArchivo() :any {
        try {
            const formularioDedatos = new FormData();            
            
            this.archivos.forEach(
                (archivo:any) => {
                    console.log(archivo)  
                    formularioDedatos.append('files', archivo, archivo.name)}
                )
            
            let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', this._userService.getToken())            
            
            
            return this._http.post('http://192.168.33.39:3900/api/upload-image-user/17',
                        JSON.stringify(formularioDedatos),
                        {headers:headers}).subscribe(
                            res => {
                                console.log(res)
                            })
        } catch (error) {
            console.log(error)
        }
    }
}







// import { FormGroup, Validators, FormControl } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { GLOBAL } from "../../services/global"
    
// @Component({
//   selector: 'myfileupload',
//   templateUrl: './upload-image.component.html'
// })

// export class myfileuploadComponent {
//   imgFile: string;
//   url: string;

//    uploadForm = new FormGroup({
//     name: new FormControl('', [Validators.required]),
//     file: new FormControl('', [Validators.required]),
//     imgSrc: new FormControl('', [Validators.required])
//   });
  
//   constructor(private httpClient: HttpClient) {

//     this.imgFile = ''
//     this.url = GLOBAL.url

//    }
    
//   get uf(){
//     return this.uploadForm.controls;
//   }
   
//   onImageChange(e:any) {
//     const reader = new FileReader();
    
//     if(e.target.files && e.target.files.length) {
//       const [file] = e.target.files;
//       reader.readAsDataURL(file);
    
//       reader.onload = () => {
//         this.imgFile = reader.result as string;
//         this.uploadForm.patchValue({
//           imgSrc: reader.result
//         });
   
//       };
//     }
//   }
   
//   upload(){
//     console.log(this.uploadForm.value);
//     this.httpClient.post(this.url+'upload-image-user/17', this.uploadForm.value)
//       .subscribe( (response) => {
//         alert('Image has been uploaded.');
        
//         },(err) => {
//             console.log(err)
//         }
    
//     )
//   }
// }