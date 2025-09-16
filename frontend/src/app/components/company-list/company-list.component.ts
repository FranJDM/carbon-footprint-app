// src/app/components/company-list/company-list.component.ts
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmissionRecordDetails } from '../../models/emission.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.css']
})
export class CompanyListComponent implements OnChanges {
  @Input() company: Company | null = null;
  @Input() companies: Company[] = [];
  @Input() editingCompany: Company | null = null;
selectedCompanyId = signal<number | null>(null);
  emissions: EmissionRecordDetails[] = [];
  companyForm: FormGroup;
  newCompanyForm: FormGroup;

  @Output() companySelected = new EventEmitter<Company>();
  @Output() companyAdded = new EventEmitter<void>();
  @Output() operationCompleted = new EventEmitter<void>();

  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder
  ) {
    this.newCompanyForm = this.fb.group({
      name: ['', Validators.required],
      sector: ['', Validators.required],
    });

    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      sector: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingCompany'] && this.editingCompany) {
      // Precargar formulario cuando parent establece editingCompany
      this.newCompanyForm.patchValue({
        name: this.editingCompany.name || '',
        sector: this.editingCompany.sector || ''
      });
      // Aseguramos que el formulario marque touched/dirty si procede (opcional)
    }
  }

  // Método para crear nueva empresa desde el form
  addCompany(): void {
    if (this.newCompanyForm.valid) {
      this.companyService.createCompany(this.newCompanyForm.value).subscribe({
        next: () => {
          this.newCompanyForm.reset();
          this.companyAdded.emit();        // notifica creación
          this.operationCompleted.emit();  // cierra el form / pide recarga
        },
        error: (err) => {
          console.error('Error creando empresa:', err);
        }
      });
    }
  }

  // Selección simple (si no estamos en edición)
  selectCompany(company: Company): void {
    if (!this.editingCompany) {
      this.companySelected.emit(company);
    }
  }

  // Submit para crear o actualizar (usado cuando el componente se utiliza como form)
  submitCompany(): void {
    if (this.editingCompany) {
      const updatedCompany = { id: this.editingCompany.id, ...this.newCompanyForm.value };
      this.companyService.updateCompany(this.editingCompany.id, updatedCompany).subscribe({
        next: () => {
          this.operationCompleted.emit(); // actualiza lista en el padre
        },
        error: (err) => {
          console.error('Error actualizando empresa:', err);
        }
      });
    } else {
      if (this.newCompanyForm.valid) {
        this.companyService.createCompany(this.newCompanyForm.value).subscribe({
          next: () => {
            this.companyAdded.emit();
            this.operationCompleted.emit();
          },
          error: (err) => {
            console.error('Error creando empresa:', err);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.operationCompleted.emit();
  }
}
