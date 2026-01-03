import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    TuiButton
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {

  constructor(private router: Router) { }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

}
