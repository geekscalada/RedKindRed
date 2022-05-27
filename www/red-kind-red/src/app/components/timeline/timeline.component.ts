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
    public token: any;
    public title: string;
    public url: string;
    public status: string = '';
    public page: any;
    public pagesPublications: any;
    public totalPublications: any;
    public itemsByPage : any;
    public screenWidth: any;


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
    
    
    getPublications(page: any) {
        this._publicationService.getPublications(this.token, page).subscribe(
            (response) => {
                
                try {
                    if (!response.docs) {
                        throw new Error('Algo ha fallado')
                    }

                    if (response.pages == 0) {
                      return this.showEmptyPublications = true;
                    }

                    this.totalPublications = response.total;
                    this.pagesPublications = response.pages;
                    this.itemsByPage = response.paginate;

                    //Adding publications
                    this.publications = this.publications.concat(response.docs)

                    if (this.page >= this.pagesPublications) {
                        this.noMore = true;
                    }

                    return this.lazyload();

                } catch (error) {
                    // #TODO hacer que el error se muestre por front
                    console.log("Error", error)
                    return this.status = 'error'
                    
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

   async lazyload(){
        this.noMore = true;
        if(this.page == 1){
            
            let startImages = 3;

            // Cargamos desktop
            if(this.screenWidth >= 587) {                
                startImages = 6;
            }

            for (let index = 0; index < this.publications.length && index < startImages; index++){
                this.getImagePubv2(this.publications[index].id, index)
            }            

            await this.delay(2000);
            
            for (let index = startImages; index < this.publications.length; index++){
                await this.delay(100);
                this.getImagePubv2(this.publications[index].id, index)
            }            

        } else {
            for (let index = ((this.page-1)*this.itemsByPage) ; index < this.publications.length; index++){
                await this.delay(100);
                this.getImagePubv2(this.publications[index].id, index)
            }
        }
        if (this.page < this.pagesPublications){
            this.noMore = false;
        } 
    }

    getImagePubv2(idpub:any, index:any):any {
        this._publicationService.getImagePubv2(this.token, JSON.stringify(idpub)).subscribe(
            (response) => {

                let newUrl = URL.createObjectURL(response)                
                let newImage = this._sanitizer.bypassSecurityTrustUrl(newUrl)

                return this.publications[index].file = newImage;
                
                // #TODO arreglar

                throw new  Error("No existe la publicación en memoria")
            },
            (error) => {
                console.log("Error en la petición de imagen", error)
                // TODO: crear variable error para mostrarlo en el danger
            }
        )
    }

    getImagePub(imageFile :any, index:any):any {        
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
        console.log(this.page, this.pagesPublications)

        this.page += 1
        if (this.page == this.pagesPublications) {
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
        this.screenWidth = window.innerWidth;
        this.getPublications(1);
    }

    delay(ms:number){
        return new Promise(
            resolve => setTimeout(resolve, ms)
        );
    }
}