import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Publication } from "../../models/publication";
import { UserService } from "../../services/user.service";
import { UploadService } from "../../services/upload.service"
import { GLOBAL } from "../../services/global"
import { PublicationService } from "../../services/publications.service";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

    // declaramos una propiedad en la que guardaremos
    // el array de publicaciones
    // = [] para indicarlo que partimos como vacío
    public publications: Publication[] = []
   

    public showEmptyPublications:boolean = false;

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
    getPublications(page: any) {
        this._publicationService.getPublications(this.token, page).subscribe(
            (response) => {
                try {
                    if (!response.docs) {
                        throw new Error('Algo ha fallado')
                    }

                    this.total = response.total;
                    this.pages = response.pages;
                    console.log("response pages", response.pages)

                    //no tiene ningún efecto
                    this.itemsPerPage = 2                  
                    
                    let lengthPublications = this.publications.length

                    this.publications = this.publications.concat(response.docs)



                    if (this.page >= this.pages) {
                        this.noMore = true;
                    }

                    //TODO
                    // Arreglar esto porque cuando solo hay una página,
                    // al hacer un getPublications para la pagina 2
                    // hay un punto en el que tenemos length = 0

                    if (response.pages == 0) {
                        this.showEmptyPublications = true;
                    }

                    this.iterateImages(lengthPublications);

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

    iterateImages(preindex: any) {
        

        for (let index = preindex; index < this.publications.length; index++) {
            
            this.getImagePub(this.publications[index].file, index)
        }

    }

    getImagePub(imageFile :any, index:any):any {
        console.log(this.token)
        this._publicationService.getImagePub(this.token, JSON.stringify(imageFile)).subscribe(
            (response) => {

                let newUrl = URL.createObjectURL(response)
                
                let newImage = this._sanitizer.bypassSecurityTrustUrl(newUrl)
               
                this.publications[index].file = newImage;                
                
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
        
        this.getPublications(this.page);

        //añadimos linea JQuery para que nos haga la animación de bajar
                        // le pasamos un objeto json como parametro
                        // con la propiedad del body de scrollTop y 500 milisegundos
                        $("html, body").animate({ scrollTop: $('body').prop("scrollHeight") }, 500)
    }

    ngOnInit() {
        console.log('timeline cargado')
        // Trick para que nos muestre en la primera carga las 
        // dos primeras páginas, pero habría que arreglar la 
        // api para que te permita cargar las páginas que quieras
        // y de hecho crear un lazy load
        console.log(this.page)
        this.getPublications(1);        
        console.log(this.page)
        this.getPublications(2)
        this.page += 1
        console.log(this.page)
                
    }

}