import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Publication } from "../../models/publication";
import { UserService } from "../../services/user.service";
import { UploadService } from "../../services/upload.service"
import { GLOBAL } from "../../services/global"
import { PublicationService } from "../../services/publications.service";


const $ = require('jquery')


@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    providers: [UserService, PublicationService]
})

export class TimelineComponent implements OnInit {

    public identity: any;
    public token: any
    public title: string
    public url: string
    public status: string = ''
    public page: any
    public pages: any
    public total: any;
    public itemsPerPage: any;

    // declaramos una propiedad en la que guardaremos
    // el array de publicaciones
    // = [] para indicarlo que partimos como vacío
    public publications: Publication[] = []


    constructor(

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService




    ) {

        this.title = "Timeline"
        this.url = GLOBAL.url
        this.page = 1
        this.token = this._userService.getToken();



    }

    // adding es un parámetro que añadimos para 
    // paginar nuevas publicaciones
    // si no añadimos ese parámetro, es false
    getPublications(page: any, adding: any = false) {
        this._publicationService.getPublications(this.token, page).subscribe(
            response => {
                
                if (response.publications) {
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage = response.items_per_page

                    console.log(response)

                    // si el parámetro viene a false
                    if (!adding) {

                        this.publications = response.publications

                    } else {

                        let arrayA = this.publications;
                        let arrayB = response.publications
                        // si estamos en la pag 3, en arrayA tendremos pag 1 y 2 y en B la 3                    

                        this.publications = arrayA.concat(arrayB)

                        //añadimos linea JQuery para que nos haga la animación de bajar
                        // le pasamos un objeto json como parametro
                        // con la propiedad del body de scrollTop y 500 milisegundos
                        $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")}, 500)

                    }


                    if (page > this.pages) {
                        //this._router.navigate(['/home'])
                    }

                } else {
                    this.status = 'error'
                }
            },
            error => {
                // let errorMessage = <any>error
                // if(errorMessage != null) {
                //     this.status = 'error' 
                // }

                // lo cambio por esto
                this.status = 'error'
                console.log("Error", error)

            }
        )

    }

    // public noMore = false;
    // viewMore(){
    //             //esta logica no está bien hecha, mirar con mami y sigoamami




    //     console.log(this.publications.length)
    //     console.log(this.total)
    //     console.log(this.itemsPerPage)


    //     if(this.publications.length == this.total){
    //         this.noMore = true;
    //     } else {
    //         this.page += 1;
    //     }

    //     this.getPublications(this.page, true);
    // }

    public noMore = false;
    viewMore() {        
        this.page += 1
        if (this.page == this.pages) {
            this.noMore = true;
        }
        console.log("ahora el this.page vale: ", this.page) 
        this.getPublications(this.page, true);
    }

    ngOnInit() {
        
        console.log('timeline cargado')
        this.getPublications(this.page, true);
    }
    
    }