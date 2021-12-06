import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
    
  // API url
  baseApiUrl = "'http://192.168.33.39:3900/api/upload-image-user/17'"
  
  
  
  constructor(private http:HttpClient) { }
  
  // Returns an observable
  upload(file:any):Observable<any> {
  
      // Create form data
      const formData = new FormData(); 
        
      // Store form name as "file" with file data
      formData.append("file", file, file.name);
        
      // Make http post request over api
      // with formData as req

      let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTcsIm5hbWUiOiJqb3NlbGUiLCJzdXJuYW1lIjoiam9zZWxlIiwibmljayI6Impvc2VsZSIsImVtYWlsIjoiam9zZWxlQGhvbGEuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImltYWdlIjpudWxsLCJwcnVlYmEiOiJwcnVlYmEiLCJpYXQiOjE2Mzg1NTExNTl9.A-ieXFvtpRQkG1tIYDTUsGctc4y7Etu2OGsBpulDpwQ')
      return this.http.post(this.baseApiUrl, formData)
  }
}