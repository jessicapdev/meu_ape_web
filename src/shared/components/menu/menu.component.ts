import { Component } from '@angular/core';
import { UserIcon, SearchIcon, LucideAngularModule } from 'lucide-angular';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-menu',
  imports: [
    LucideAngularModule,
    TuiButton,
    TuiIcon
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  readonly User = UserIcon;
  readonly Search = SearchIcon;

}
