import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDialogService, TuiTextfield } from '@taiga-ui/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalQuartosComponent } from '../../../shared/components/modal-quartos/modal-quartos.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, 
    TuiTextfield,
    TuiButton,
    ModalQuartosComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class HomeComponent  {
  @ViewChild('quartosDialog', { static: true })
  showModalQuartos = false;

  protected openStatus = false;
  protected openPreco = false;
  protected incialSearchForm = new FormGroup({
    local: new FormControl(''),
    quartos: new FormControl(''),
    status: new FormControl(''),
  })

  constructor(
    private readonly dialogs: TuiDialogService,
  ) {}

  onSubmit(){
    console.log(this.incialSearchForm.value);
  }

  openQuartos(){
    this.showModalQuartos = true;
  }
}
