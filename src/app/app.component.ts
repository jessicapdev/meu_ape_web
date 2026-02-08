import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../shared/components/menu/menu.component';
import { TuiRoot } from '@taiga-ui/core';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuComponent,
    TuiRoot,
    FooterComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portal-meu-ape';
}
