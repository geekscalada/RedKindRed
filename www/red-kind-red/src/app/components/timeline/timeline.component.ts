import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Publication } from "../../models/publication";
import { UserService } from "../../services/user.service";
import { UploadService } from "../../services/upload.service"
import { GLOBAL } from "../../services/global"
import { PublicationService } from "../../services/publications.service";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


const $ = require('jquery')


@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['../../styles/timeline.styles.css'],
    providers: [UserService, PublicationService, NgbModal]
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
        private _publicationService: PublicationService,
        private _modalService: NgbModal
    ) {
        this.title = "Timeline"
        this.url = GLOBAL.url
        this.page = 1
        this.token = this._userService.getToken();
    }

    open(content :any) {
        console.log(content)
        this._modalService.open(content);
    }
    
    
    // adding es un parámetro que añadimos para 
    // paginar nuevas publicaciones
    // si no añadimos ese parámetro, es false
    getPublications(page: any, adding: any = false) {
        this._publicationService.getPublications(this.token, page).subscribe(
            (response) => {
                try {

                    if (!response.docs) {

                        throw new Error('Algo ha fallado')

                    }

                    this.total = response.total;
                    this.pages = response.pages;
                    this.itemsPerPage = 2

                    //si no estamos pulsando viewMore
                    if (!adding) {

                        this.publications = response.docs

                    } else {

                        this.publications = this.publications.concat(response.docs)

                        //añadimos linea JQuery para que nos haga la animación de bajar
                        // le pasamos un objeto json como parametro
                        // con la propiedad del body de scrollTop y 500 milisegundos
                        $("html, body").animate({ scrollTop: $('body').prop("scrollHeight") }, 500)
                    }

                    console.log(this.publications)

                } catch (error) {
                    this.status = 'error'
                    console.log("Error", error)
                }
            },
            (error) => {
                this.status = 'error'
                console.log("Error", error)

            }
        )

    }

    public noMore = false;
    viewMore() {
        console.log(this.page, this.pages)

        this.page += 1
        if (this.page == this.pages) {
            this.noMore = true;
        }
        console.log("ahora el this.page vale: ", this.page)
        this.getPublications(this.page, true);
    }

    ngOnInit() {
        console.log('timeline cargado')
        // Trick para que nos muestre en la primera carga las 
        // dos primeras páginas, pero habría que arreglar la 
        // api para que te permita cargar las páginas que quieras
        // y de hecho crear un lazy load
        this.getPublications(this.page, true);
        this.viewMore();
    }

}