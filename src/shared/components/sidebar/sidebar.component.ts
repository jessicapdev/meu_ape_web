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
     {
      label: 'Perfil',
      icon: '@tui.user',
    },
    {
      label: 'Mensagens Recebidas',
      icon: '@tui.notebook-tabs',
    },
    {
      label: 'Empreendimentos',
      icon: '@tui.building',
    }
  ];

  onMenuItemClick(item: any): void {
    this.menuItemClicked.emit(item);
  }

}