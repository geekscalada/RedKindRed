import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, Params, RouterModule} from '@angular/router'

import { User } from 'src/app/models/user';

import { GLOBAL } from 'src/app/services/global';
import { Console } from 'console';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['../../styles/users.styles.css'],
    providers: [UserService]
})

export class UsersComponent implements OnInit{

    public title:string;
    public url:string;
    public identity: any;
    public token: any;
    // probablemente borrar
    public page:any;
    public next_page:any;
    public prev_page:any;
    public total:any;
    public pages:any;
    public users: User[]
    public status:any
    public friends:any = []
    public ReqFriends:any = []
    public OwnReqFriends:any = []
    // probablemente borrar
    public showAcceptDenied: boolean = false

    constructor(

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,


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

    // esto borrarlo probablemente
    showAcceptDeniedFunction(value: boolean){
        if(!value){
            return setTimeout( ()=> {this.showAcceptDenied = false}, 1000)
        }
        return this.showAcceptDenied = true
    }

    setAcceptDenied(){
        return this.showAcceptDenied = false 
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
                this.getMyOwnReqFriends();
                this.getFriends();

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

            },(error)=>{
                console.log(error)
            }
        )
    }

    //en realidad es my want friends
    getMyReqFriends(){
        
        this._userService.getMyReqFriends(this.identity.id).subscribe(
            (response)=>{
                
                this.ReqFriends = response;                

            },(error)=>{
                console.log(error)
            }
        )
    }

    //mis solicitudes realizadas no las que yo he recibido

    getMyOwnReqFriends(){
        
        this._userService.getMyOwnReqFriends(this.identity.id).subscribe(
            (response)=>{
                
                this.OwnReqFriends = response;
                console.log(this.OwnReqFriends)                

            },(error)=>{
                console.log(error)
            }
        )
    }
    
    

    ngOnInit(){
        console.log("modulo Gente cargado")
        this.getAllusers();
        this.getFriends();
        this.getMyReqFriends();
        this.getMyOwnReqFriends();        
        //this.actualPage();
        console.log(this.users)
    }

}
