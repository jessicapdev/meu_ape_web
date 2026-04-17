import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-alert-message',
  imports: [
    CommonModule, 
    TuiIcon
  ],
  standalone: true,
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertMessageComponent {

  @Input() type: 'error' | 'success' = 'error';
  @Input() message = '';
  @Input() show = false;
    
  get icon(): string {
      return this.type === 'error' ? '@tui.circle-x' : '@tui.circle-check';
  }
  
  get iconColor(): string {
      return this.type === 'error' 
          ? 'var(--tui-background-error)' 
          : 'var(--tui-background-success)';
  }
  
  get messageClass(): string {
      return this.type === 'error' ? 'error-message' : 'success-message';
  }

}
