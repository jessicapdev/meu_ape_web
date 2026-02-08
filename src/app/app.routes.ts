import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { EmpreendimentoComponent } from './pages/empreendimento/empreendimento.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { LoginComponent } from './pages/login/login.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { FaleConoscoComponent } from './pages/fale-conosco/fale-conosco.component';
import { AuthGuard } from './core/services/auth-guard.service';

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
        path: 'empreendimento', 
        component: EmpreendimentoComponent 
    },
    { 
        path: 'perfil', 
        canActivate: [AuthGuard],
        component: PerfilComponent 
    },
    { 
        path: 'login', 
        component: LoginComponent 
    },
    { 
        path: 'recuperar-senha', 
        component: RecuperarSenhaComponent 
    },
    { 
        path: 'contato', 
        component: FaleConoscoComponent 
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
