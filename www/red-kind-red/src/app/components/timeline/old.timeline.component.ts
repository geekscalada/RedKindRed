import { Component, OnInit, SecurityContext } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Publication } from "../../models/publication";
import { UserService } from "../../services/user.service";
import { UploadService } from "../../services/upload.service"
import { GLOBAL } from "../../services/global"
import { PublicationService } from "../../services/publications.service";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Sanitizer } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";


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

    public newImage: any;

    // declaramos una propiedad en la que guardaremos
    // el array de publicaciones
    // = [] para indicarlo que partimos como vacío
    public publications: Publication[] = []    


    constructor(

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _modalService: NgbModal,
        private _sanitizer: DomSanitizer
    ) {
        this.title = "Timeline"
        this.url = GLOBAL.url
        this.page = 1
        this.token = this._userService.getToken();
    }


    // Open modal
    open(content :any) {
        // console.log(content)
        this._modalService.open(content, {            
            backdropClass: 'mymodal-backdrop',
            modalDialogClass: 'mymodal-dialog',
            windowClass: "mywindow-class",            
            centered: true,
            scrollable: false
        });
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

                    //no tiene ningún efecto
                    this.itemsPerPage = 2

                    //si no estamos pulsando viewMore
                    if (adding) {

                        this.publications = response.docs 

                        this.iteratingImages();


                    } else {

                        this.publications = this.publications.concat(this.publications)

                        if (this.page == this.pages) {
                            this.noMore = true;
                        }

                        this.iteratingImages();

                        //añadimos linea JQuery para que nos haga la animación de bajar
                        // le pasamos un objeto json como parametro
                        // con la propiedad del body de scrollTop y 500 milisegundos
                        $("html, body").animate({ scrollTop: $('body').prop("scrollHeight") }, 500)
                    }

                    console.log("this.publications ---->>", this.publications)

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

    iteratingImages(){

        for(let index in this.publications){

            this.getImagePub(this.publications[index].file, index)

        }
    }


    getImagePub(imageFile :any, index:any):any {
        this._publicationService.getImagePub(this.token, JSON.stringify(imageFile)).subscribe(
            (response) => {

                console.log("Ejecutando el getImagePub", response)

                let newUrl = URL.createObjectURL(response)
                
                let newImage = this._sanitizer.bypassSecurityTrustUrl(newUrl)
                
                this.newImage = newImage;

                this.publications[index].file = newImage;

                console.log("mola la imagen")

            },
            (error) => {
                console.log("Error en la petición de imagen", error)
                // TODO: crear variable error para mostrarlo en el danger
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
        console.log(this.page)
        this.getPublications(1, true);        
        console.log(this.page)
        this.getPublications(2, true)
        this.page += 1
        console.log(this.page)        
                
    }

}