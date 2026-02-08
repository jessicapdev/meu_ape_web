// sidebar.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  TuiButton, 
  TuiDataList,
  TuiIcon
} from '@taiga-ui/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiDataList,
    TuiIcon
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() menuItemClicked = new EventEmitter<void>();

  menuItems = [
    // {
    //   label: 'Favoritos',
    //   icon: '@tui.star',
    //   route: '/favoritos',
    // },
    // {
    //   label: 'Visualizados',
    //   icon: '@tui.eye',
    //   route: '/visualizados',
    // },
    // {
    //   label: 'Contatados',
    //   icon: '@tui.notebook-tabs',
    //   route: '/contatados',
    // },
    {
      label: 'Perfil',
      icon: '@tui.user',
      route: '/perfil'
    }
  ];

  onMenuItemClick(): void {
    this.menuItemClicked.emit();
  }

}