import { Component, OnInit } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';
  
@Component({
    selector: 'app-file-upload',
    templateUrl: './upload-image.component2.html'
})
export class FileUploadComponent implements OnInit {
  
    public uploadedFiles: Array < File > ;

    constructor(private http: HttpClient,
        
        public _userService: UserService,
        public URL: String,
        
        
        ){

        this.uploadedFiles = []
        this.URL = GLOBAL.url

    }

    ngOnInit() {

    }

    fileChange(element:any) {
        this.uploadedFiles = element.target.files;
    }

    upload() {
        let formData = new FormData();
        for (var i = 0; i < this.uploadedFiles.length; i++) {
            console.log(this.uploadedFiles[i])
            formData.append("files", this.uploadedFiles[i], this.uploadedFiles[i].name);
        }

        let myformData = JSON.stringify(formData)
        
        let headers = new HttpHeaders()
        .set('Authorization', JSON.stringify(this._userService.getToken()))

        // let identity = this._userService.getIdentity();

        // let userId = identity.id;
        

        this.http.post(this.URL+'17', formData, {headers:headers})
            .subscribe((response:any) => {
                console.log('response received is ', response);
            })
    }
}