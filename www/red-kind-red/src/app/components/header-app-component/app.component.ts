import { Component, OnInit, DoCheck } from '@angular/core';
// Aquí importamos el userService porque lo que queremos es que 
// todo el app tenga disponible identity y token
import { UserService } from 'src/app/services/user.service';

import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router'
import { GLOBAL } from 'src/app/services//global';
import { DataService } from 'src/app/services/data.service';
import { convertTypeAcquisitionFromJson } from 'typescript';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../../styles/navigation.styles.css'],
  providers: [UserService, DataService]
})
export class AppComponent implements OnInit, DoCheck {

  public title: String
  public identity: any = null;
  //public token:any
  public url: string
  public toggle = false;


  constructor(

    private _userService: UserService,
    private _router: Router,
    private dataService: DataService


  ) {

    this.title = 'red-kind-red'
    this.url = GLOBAL.url

  }


  //#TODO quitar los logs
  // Se podría escuchar solo en ciertos momentos y no desde el principio. 
  // Evaluar conveniencia de esto
  ngOnInit() {

    console.log("estamos suscritos")
    this.dataService.messageSubject.subscribe((msg: any) => {
      console.log(msg)
      this.refreshIdentity();

    })

    this.identity = this._userService.getIdentity();
    console.log("app component cargado")
    //this.token = this._userService.getToken();   

  }

  // Aquí el DoCheck sirve para refrescar el navbar cuando cambia
  // el this.identity, entonces esto nos sirve por ejemplo
  // para que cuando hagamos login se refresque el navbar
  // ya que el identity se refresca luego pero el navbar no 
  // se recarga si no es a través del doCheck
  // otra opción sería comunicar los componentes a través de
  // mensajes a través de un servicio
  // es normal que cambiando de pestañas desde el navbar se ejecute el 
  // do check, porque compueba cambio. 
  ngDoCheck() {

    console.log("ejecutamos docheck")
    this.identity = this._userService.getIdentity();

  }

  logout() {
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/login']);
  }

  refreshIdentity() {

    // aquí para evitar que el doCheck vuelva a actuar después
    // y recoga los datos del localstorage antiguos, cambio los datos
    // del localstorage y dejo que el docheck actualice la propiedad identity
    this._userService.getIdentityFromDB(this.identity).subscribe(
      response => {
        localStorage.setItem('identity', JSON.stringify(response.userInBDD))

      }
    )

  }

  clickmenu() {
    this.toggle = true;
  }

  clickoutsidemenu() {

    this.toggle = false;

  }



}
