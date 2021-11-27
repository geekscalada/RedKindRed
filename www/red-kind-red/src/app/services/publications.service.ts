import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { GLOBAL } from "./global"
import { Publication } from "../models/publication";
import { UserService } from "./user.service";




@Injectable()
export class PublicationService{

    public url:string;

    constructor(

        private _http: HttpClient,
        private _userService: UserService

    ){

        this.url = GLOBAL.url;
        
    }

    addPublication(token:any, publication:any):Observable<any>{
        
                
        let params = JSON.stringify(publication)

        
        
        // params.identity = JSON.stringify(identity)
        
        let headers = new HttpHeaders().set('Content-type', 'Application/json')
        .set('Authorization', token)

        // 'publication' es la ruta de la api
        return this._http.post(this.url+'publication', params, {headers: headers})

    }

    //este metodo hará una petición ajax
    getPublications(token:any, page:any = 1):Observable<any> {        
        
                
        let headers = new HttpHeaders().set('Content-type', 'Application/json')
        .set('Authorization', token)
        return this._http.get(this.url+'publications/'+page, {headers:headers})

    }

    deletePublications(token:any, id:any):Observable<any> {
        let headers = new HttpHeaders().set('Content-type', 'Application/json')
        .set('Authorization', token)

        return this._http.delete(this.url+ 'publication/'+id, {headers:headers});


    }
    



}