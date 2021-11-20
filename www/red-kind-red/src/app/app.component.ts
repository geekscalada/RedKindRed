import { Component, OnInit, DoCheck } from '@angular/core';
// Aquí importamos el userService porque lo que queremos es que 
// todo el app tenga disponible identity y token
import { UserService } from './services/user.service';

import { Router, ActivatedRoute, Params, RouterModule} from '@angular/router'
import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  
  public title:String
  public identity:any = null;
  //public token:any
  public url:string
  
  
  constructor(

    private _userService:UserService,
    private _router:Router,
    

  ){

    this.title = 'red-kind-red'
    this.url = GLOBAL.url       

  }

  ngOnInit(){

    this.identity = this._userService.getIdentity();
    //this.token = this._userService.getToken();

  }

  // esto lo que hace es que cada vez que se cambien ciertos datos
  // se refresque la lógica que nosotros le indiquemos
  ngDoCheck(){
    
    this.identity = this._userService.getIdentity();
    

  }

  logout(){
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);
  }

}
