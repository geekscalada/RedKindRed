import { Injectable } from "@angular/core";
import { GLOBAL } from "./global";

@Injectable()

export class UploadService{

    public url: string;

    constructor(

    ){
        this.url = GLOBAL.url
    }

    //vamos a usar una petición xhr típica
    makeFilerequest(url: string, params: Array<string>,
        files: Array<File>, token: string, name: string){
            // lo vamos a hacer con una promesa

            return new Promise(function(resolve, reject) {
                let formData: any = new FormData();

                //este es el objeto que nos permite hacer
                // requests en javascript puro
                let xhr = new XMLHttpRequest();

                for(let i = 0; i < files.length; i++){
                    
                    formData.append(name, files[i], files[i].name)
                }

                //hacemos la petición ajax

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200){
                            resolve(JSON.parse(xhr.response))
                        } else {
                            reject(xhr.response)
                        }
                    }
                }

                // aquí es donde hacemos la petición
                // true es para que haga la petición

                xhr.open('POST', url, true)
                xhr.setRequestHeader('Authorization', token)
                xhr.send(formData)

            })


        }

}
