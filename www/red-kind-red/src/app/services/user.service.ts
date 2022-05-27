// nos permitirá definir los servicios y después inyectarlos en otras clases
import { Injectable } from "@angular/core";

//httpclient para poder hacer las peticiones ajax y httpheaders
// para poder enviar cabeceraas en cada una de las peticiones ajax
import { HttpClient, HttpHeaders } from "@angular/common/http";

// Para poder recoger las respuestas que nos devuelve la API
import { Observable, Subject } from "rxjs";


//Archivo que definimos nosotros mismos y que es donde declaramos
// ciertas variables que usaremos
import { GLOBAL } from "./global"

// Modelo usuario
import { User } from "../models/user";

import { BehaviorSubject } from 'rxjs';


// con el decorador injectable le estamos diciendo que esta clase la podemos
// inyectar como servicio en cualquier componente
@Injectable()
export class UserService{

    public url:string;
    public identity:any;
    public token:any
    public stats:any

    constructor(        
        public _http: HttpClient
    ){
        this.url = GLOBAL.url;
    }

    // Metodo para enviar mensajes entre componentes

    //#TODO
    // En principio hay que borrar esto, el messageSouce y el método sendmessage
    // porque finalmente lo hice todo através de dataSource
    private subject = new Subject();
    public subject2 = new Subject();
    
    

    sendMessage(message :any) {
        console.log("vamos a enviar el mensaje")        
        this.subject2.next(message);
    }

    private messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();

  

    changeMessage(message: string) {
        this.messageSource.next(message)
    }
    


    /* Al usar el método nuevo Httpclient ya no tenemos que mapear
    respuestas ni nada. Simplemente decirle que lo que va a devolver
    este método de este servicio es un observable con : Observable 
    de momento con tipo any, ya que si le ponemos tipo User, y un día
    la api nos trae más cosas de las que hay en el modelo se va a romper
    */ 
    register(user:User):Observable<any>{
       
        let params = JSON.stringify(user)
        //seteamos cabeceras, cuando le decimos application/json lo que ocurre es que automáticamente cuando yo 
        // le envíe un json al backend el node.js ya es capaz de procesarlo, por ejemplo con php muchas veces es 
        // necesario usar www url encoded y tal
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        console.log("params de registro", params)
        
        // envialos la petición, con esto ya hace la petición ajax al backend y nos guarda
        // el usuario
        return this._http.post(this.url+'register', params, {headers:headers} )

    }

    // ponemos any en el user porque al parecer no tenemos propiedad getToken en el modelo
    // la otra opción es usar gettoken:any = 'null' pero parece una chapuza
    signUp(user:any, getToken:any = null): Observable<any>{          
        if(getToken != null) {
            // la propoedad del modelo de la api es con minúscular
            user.gettoken = getToken;
        }

        let params = JSON.stringify(user)        

        let headers = new HttpHeaders().set('Content-Type', 'application/json')

        return this._http.post(this.url+'login', params, {headers:headers} )
    }

    // aquí crearemos 2 metodos para rescatar del local storage los datos
    // identity y token
    

    //#cambiar por getPerfil
    getIdentity(){        

           let identity:any = localStorage.getItem('identity');           
           identity = JSON.parse(identity);

           if (identity) {
               this.identity = identity
           } else {
               this.identity = null
           }

           return this.identity          
        
    }

    getIdentityFromDB(user: any): Observable<any>{

        console.log("myuserrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr" ,user)

        let params = JSON.stringify(user)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')

        return this._http.post(this.url+'getIdentityFromDB', params, {headers:headers} )

        
    }

    getToken(){
        
        let token:any = localStorage.getItem('token');
           token = JSON.stringify(token);

           if (token != undefined) {
               this.token = token
           } else {
               this.token = null
           }

           return this.token 

    }

    getStats(){
        
        let stats:any = localStorage.getItem('stats')
        stats = JSON.parse(stats)

        console.log(stats)

        if(stats != "undefined"){
            this.stats = stats
        } else {
            this.stats = null
        }

        return this.stats
    }

    getCounters(userId = null): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken())

        if (userId != null) {
            return this._http.get(this.url + 'counters/' + userId, { headers: headers })
        } else {
            return this._http.get(this.url + 'counters/', { headers: headers })
        }
    }

    updateUser(user: User): Observable<any>{

    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-type', 'application/json')
    .set('Authorization', this.getToken())   
   

    return this._http.put(this.url+'update-user/'+user.id, params,{headers: headers})

    }

    uploadAvatar(userId: String, formData: FormData ): Observable<any>{
     
        let headers = new HttpHeaders()
            .set('Authorization', JSON.stringify(this.getToken()))
        return this._http.post(this.url + 'upload-image-user/' + userId, formData, { headers: headers })
        
    }

    getUsers(page:any): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type', 'aplication-json')
        .set('Authorization', this.getToken())

        return this._http.get(this.url+'users/'+page, {headers:headers})

    }

    getAllUsers(): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.getToken())
    

        return this._http.get(this.url+'allusers/', {headers:headers})


    }

    sendRequestToFriend(newParams:any): Observable<any> {

        let params = JSON.stringify(newParams)
        console.log("esto son los params del servicio", params)
        
        let headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', this.getToken())       
        
        return this._http.post(this.url+'sendReqFriend', params, {headers:headers})
    }

    getFriends(id:any){        

        let headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', this.getToken())

        return this._http.get(this.url+'getFriends/'+id, {headers:headers})

    }

    getMyReqFriends(id:any){        

        let headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', this.getToken())

        return this._http.get(this.url+'getMyReqFriends/'+id, {headers:headers})

    }

    getMyOwnReqFriends(id:any){        

        let headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', this.getToken())

        return this._http.get(this.url+'getMyOwnReqFriends/'+id, {headers:headers})

    }

    

    getUser(id:any): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.getToken())

        return this._http.get(this.url+'users/'+id, {headers:headers})

    }

    


}








