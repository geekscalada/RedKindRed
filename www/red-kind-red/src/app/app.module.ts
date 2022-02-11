import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {FormsModule, ReactiveFormsModule} from '@angular/forms'
//deprecated -> import { HttpModule } from '@angular/common'
import {HttpClientModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';


//importamos pipes

import { FilterPipe } from './pipes/searching-filter.pipe';
import { TakePublicationComponent } from './components/sidebar/takepublication.component';


// Añadimos los routings
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
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
  ],
  providers: [
    AppRoutingProviders
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
