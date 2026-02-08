import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TuiLink, TuiSurface, TuiTitle } from '@taiga-ui/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    TuiLink,
    TuiSurface,
    TuiTitle,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
