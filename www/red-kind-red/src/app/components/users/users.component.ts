import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, Params, RouterModule} from '@angular/router'

import { User } from 'src/app/models/user';

import { GLOBAL } from 'src/app/services/global';

import { FollowService } from 'src/app/services/follow.service';
import { Follow } from 'src/app/models/follow';
import { Console } from 'console';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers: [UserService, FollowService]
})

export class UsersComponent implements OnInit{

    public title:string;
    public url:string;
    public identity: any;
    public token: any;
    public page:any;
    public next_page:any;
    public prev_page:any;
    public total:any;
    public pages:any;
    public users: User[]
    public status:any
    public follows:any; //estamos siguiendo
    public friends:any = []
    public ReqFriends:any = []     

    constructor(

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService


    ) {

        this.title = 'Gente'
        this.url = GLOBAL.url
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        // tengo que añadir esto para que me deje
        this.users = []
    }

    //#cambiar y meterlo en el constructor
    filterUsers= ''



    actualPage(){
        //params captura el parámetro de la ruta

        this._route.params.subscribe(params => {
            // convertimos a entero con el +
            let page = +params['page']
            
            this.page = page;

            if (!page){
                page = 1
            }
            
            if(!page){
                page = 1
            } else {
                this.next_page = page+1
                this.prev_page = page-1

                if(this.prev_page <= 0 ){
                    this.prev_page = 1
                }
            }

            //devolver listado usurios
            this.getUsers(page)

        })

    }

    getAllusers(){

        this._userService.getAllUsers().subscribe(
            (response) => {
                console.log(response)
                this.users = response
            },

            (error) => {
                console.log('error')
                console.log(error)
            }
        )

    }

    sendRequestToFriend(params:any){

        let insertParams = {
            'IDtarget': params.toString()
        }
       

        this._userService.sendRequestToFriend(insertParams).subscribe(
            (response) => {

                console.log(response)

            },(error) => {

                console.log('error')
                console.log(error)
            }
        )
    }

    getFriends(){
        
        this._userService.getFriends(this.identity.id).subscribe(

            (response)=>{
                
                this.friends = response;
                console.log(this.friends)

            },(error)=>{
                console.log(error)
            }


        )

    }

    getMyReqFriends(){
        
        this._userService.getMyReqFriends(this.identity.id).subscribe(

            (response)=>{
                
                this.ReqFriends = response;

                console.log(this.ReqFriends)

            },(error)=>{
                console.log(error)
            }


        )

    }



    // aquí hace un = null para hacer default pero a mí
    // no me deja hacerlo
    getUsers(page:any){
       
        this._userService.getUsers(page).subscribe(
            response => {
                

                if(!response.users){
                    this.status = 'error'
                } else {
                    
                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.follows = response.users_following;

                    
                    if(page > this.pages){
                        this._router.navigate(['/gente/1'])
                    }

                }

            },
            error => {
                
                let errorMessage = <any>error
                console.log(errorMessage)
                
                if(errorMessage != null){
                    this.status = 'error'
                }
            }
        )
    }

    public followUserOver:any;
    mouseEnter(user_id:any){
        this.followUserOver = user_id
    }

    mouseLeave(user_id:any){
        this.followUserOver = 0
    }

    followUser (followed:any) {

        //identity_id viene del localstorage
        let follow = new Follow('', this.identity._id, followed);

        this._followService.addFollow(this.token, follow).subscribe(
            response => {

                if (!response) {
                    this.status = 'error'
                } else {
                    this.status = 'success'
                    // aquí añadimos al array de follos un nuevo ID y hará que la
                    // pag cambie de manera reactiva al hacer el bucle
                    console.log(this.follows)
                    this.follows.push(followed);
                    console.log(this.follows)
                }

            },
            error => {

                let errorMessage = <any>error
                console.log(errorMessage)
                
                if(errorMessage != null){
                    this.status = 'error'
                }
            }
        )


    }

    unfollowUser(followed:any) {

        this._followService.deleteFollow(this.token, followed).subscribe(
            response => {

                console.log(response)

                let search = this.follows.indexOf(followed)

                if (search != -1) {
                    // además de borrarlo de la DB también lo eliminará del array
                    // por lo que se refrescará dinámicamente
                    console.log(this.follows)                    
                    this.follows.splice(search, 1)
                    console.log(this.follows)
                }
                

            },
            error => {

                let errorMessage = <any>error
                console.log(errorMessage)
                
                if(errorMessage != null){
                    this.status = 'error'
                }
            }
        )
    }

    ngOnInit(){
        console.log("modulo Gente cargado")
        this.getAllusers();
        this.getFriends();
        this.getMyReqFriends();        
        //this.actualPage();
        console.log(this.users)
    }

}
