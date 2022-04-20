import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router"

// Importamos componentes
import { LoginComponent } from './components/loging/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgbdModalConfig } from "./components/home/modal-config";
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from "./components/timeline/timeline.component";
import { TakePublicationComponent} from "./components/sidebar/takepublication.component"
import { NativeDate } from "mongoose";

//usado para pruebas
// import { ProductAddcomponent } from "./components/home/product-add.component";


//constante appRoutes de tipo Routes
const appRoutes: Routes =  [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    // {path: 'product-add.component', component: ProductAddcomponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: 'amigos/:page', component: UsersComponent},
    {path: 'amigos', component: UsersComponent},
    {path: 'publicaciones', component: TimelineComponent},
    {path: 'publicar', component: TakePublicationComponent},
    // ruta si no encuentra nada debe ser la ultima
    {path: '**', component: UsersComponent}
]

//exportar el provider de rutas y exportar el modulo de rutas
// con la nueva conf creada

export const AppRoutingProviders: any[] = []

// le tenemos que pasar por parámetros la constante con la config creada
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);



