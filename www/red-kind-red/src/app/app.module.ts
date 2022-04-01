import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {FormsModule, ReactiveFormsModule} from '@angular/forms'
//deprecated -> import { HttpModule } from '@angular/common'
import {HttpClientModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/header-app-component/app.component';

// Aquí tenemos que importar lo que hemos hecho en el fichero
// app.routing.ts

import { routing, AppRoutingProviders } from './app.routing';
// Importamos routing que es un modulo con configuracion de rutas
// Importamos un servicio
// Ambos tienen que ser declarados en el @NgModule

import { MomentModule } from 'ngx-moment';






//Cargando componente

import { LoginComponent } from './components/loging/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgbdModalConfig } from './components/home/modal-config';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';


//importamos pipes

import { FilterPipe } from './pipes/searching-filter.pipe';
import { TakePublicationComponent } from './components/sidebar/takepublication.component';

//Importando Angular material 

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FlexLayoutModule } from "@angular/flex-layout";

//Importando image-cropper
import { ImageCropperModule } from 'ngx-image-cropper';


// Añadimos los routings
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NgbdModalConfig,
    UserEditComponent,
    UsersComponent,
    TakePublicationComponent,
    TimelineComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MomentModule,
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    ImageCropperModule
  ],
  providers: [
    AppRoutingProviders
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
