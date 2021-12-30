import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router"

// Importamos componentes

import { LoginComponent } from './components/loging/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from "./components/home/home.component";
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from "./components/timeline/timeline.component";
import { TakePublicationComponent} from "./components/sidebar/takepublication.component"
import { NativeDate } from "mongoose";


//constante appRoutes de tipo Routes
const appRoutes: Routes =  [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomeComponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: 'amigos/:page', component: UsersComponent},
    {path: 'amigos', component: UsersComponent},
    {path: 'publicaciones', component: TimelineComponent},
    {path: 'publicar', component: TakePublicationComponent},
    // ruta si no encuentra nada debe ser la ultima
    {path: '**', component: LoginComponent}
    

]

//exportar el provider de rutas y exportar el modulo de rutas
// con la nueva conf creada

export const AppRoutingProviders: any[] = []

// le tenemos que pasar por parámetros la constante con la config creada
// este any lo tengo que hacer yo xa q no me de fallo
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);



