import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButton, TuiDataList, TuiDropdown, TuiIcon, TuiOptGroup } from '@taiga-ui/core';
import { AuthenticationService } from '../../../app/core/authentication.service';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    TuiButton,
    TuiDropdown,
    TuiDataList,
    TuiOptGroup
],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  protected openDropPerfil = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  navegarParaHome(){
    this.router.navigate(['/home']);
  }

  navegarParaCadastro(){
    this.router.navigate(['/cadastro']);
  }

  navegarParaPerfil(){
    this.router.navigate(['/perfil']);
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
