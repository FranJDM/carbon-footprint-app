// src/app/components/emission-list/emission-list.component.ts
import { Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Company } from '../../models/company.model';
import { EmissionRecordDetails } from '../../models/emission.model';
import { EmissionService } from '../../services/emission.service';
import { CompanyService } from '../../services/company.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emission-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './emission-list.html',
  styleUrls: ['./emission-list.css']
})
export class EmissionListComponent implements OnInit, OnChanges {
  @Output() emissionAdded = new EventEmitter<void>();
  @Output() goBackToList = new EventEmitter<void>();

  @Input() company: Company | null = null;

  companies: Company[] = [];
  selectedCompanyId: number | null = null;
  selectedCompany: Company | null = null;

  emissions: EmissionRecordDetails[] = [];
  newEmissionForm: FormGroup;

  constructor(
    private emissionService: EmissionService,
    private fb: FormBuilder,
    private companyService: CompanyService,
  ) {
    this.newEmissionForm = this.fb.group({
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      co2e: ['', [Validators.required, Validators.min(0)]],
      date: [new Date(), Validators.required],
      companyId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.company) {
      this.loadCompanies();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['company'] && this.company) {
      this.selectedCompany = this.company;
      this.newEmissionForm.patchValue({ companyId: this.company.id });
    }
  }

  loadEmissions(): void {
    if (this.company) {
      this.emissionService.getEmissionsByCompany(this.company.id).subscribe(data => {
        this.emissions = [...data];
      });
    } else if (this.selectedCompany) {
      this.emissionService.getEmissionsByCompany(this.selectedCompany.id).subscribe(data => {
        this.emissions = [...data];
      });
    }
  }

  addEmission(): void {
    const targetCompany = this.company || this.selectedCompany;
    if (!targetCompany) {
      console.warn('No hay empresa seleccionada para la emisión');
      return;
    }

    if (this.newEmissionForm.valid) {
      const formValue = this.newEmissionForm.value;
      const formattedDate = new Date(formValue.date).toISOString().split('T')[0];

      const newEmission = {
        type: formValue.type,
        amount: formValue.amount,
        co2e: formValue.co2e,
        date: formattedDate,
        company: { id: targetCompany.id }
      };

      this.emissionService.createEmission(newEmission).subscribe({
        next: () => {
          this.newEmissionForm.reset();
          // Emitimos primero que se ha añadido y luego que volvamos al listado.
          // El padre decide si queda en "companies" y recarga las emisiones de la compañía seleccionada.
          this.emissionAdded.emit();
          this.goBackToList.emit();
        },
        error: (err) => {
          console.error('Error al crear emisión:', err);
        }
      });
    }
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (data) => this.companies = [...data],
      error: (err) => console.error('Error cargando empresas:', err)
    });
  }

  onCancel(): void {
    this.goBackToList.emit();
  }

  deleteEmission(emissionId: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar esta emisión?')) return;

    this.emissionService.deleteEmission(emissionId).subscribe({
      next: () => {
        // Si estamos creando/viendo emisiones de una compañía concreta, la recargamos
        if (this.company || this.selectedCompany) {
          this.loadEmissions();
        } else {
          // Si estábamos viendo el listado global, avisamos para que el padre recargue
          this.emissionAdded.emit();
        }
      },
      error: (err) => console.error('Error al eliminar emisión:', err)
    });
  }

  onCompanySelected(): void {
    const found = this.companies.find(c => c.id === this.selectedCompanyId);
    if (found) {
      this.selectedCompany = found;
      this.newEmissionForm.patchValue({ companyId: found.id });
    }
  }

  loadEmissionsByCompany(id: number): void {
    this.emissionService.getEmissionsByCompany(id).subscribe(data => {
      this.emissions = [...data];
    });
  }
}
