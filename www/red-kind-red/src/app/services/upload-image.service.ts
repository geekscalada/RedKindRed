import { Injectable } from "@angular/core";
import { GLOBAL } from "./global";
import { HttpClient } from "@angular/common/http";

export class ImageService {

  constructor(private http: Http) {}


  public uploadImage(image: File): Observable<Response> {
    const formData = new FormData();

    formData.append('image', image);

    return this.http.post('/api/v1/image-upload', formData);
  }
}