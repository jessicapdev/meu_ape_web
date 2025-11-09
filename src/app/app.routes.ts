import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { 
        path: 'home', 
        component: HomeComponent
    },
    { 
        path: 'cadastro', 
        component: CadastroUsuarioComponent 
    },
    { 
        path: '404', 
        component: NotFoundComponent
    },
    { 
        path: '', 
        redirectTo: '/home', 
        pathMatch: 'full', 
    },
    { 
        path: '**', 
        redirectTo: '/404'
    }
];
