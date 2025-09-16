// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { EmissionListComponent } from './components/emission-list/emission-list.component';
import { Company } from './models/company.model';
import { CompanyService } from './services/company.service';
import { EmissionService } from './services/emission.service';
import { EmissionRecordDetails } from './models/emission.model';
import { ChangeDetectorRef } from '@angular/core';
import { FilterPipe } from './pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CompanyListComponent,
    EmissionListComponent,

    FilterPipe,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'carbon-footprint-ui';
  selectedCompany: Company | null = null;
  companies: Company[] = [];
  allEmissions: EmissionRecordDetails[] = [];
currentView: 'companies' | 'emissions' | 'companyForm' | 'emissionForm' = 'companies';
  editingCompany: Company | null = null;
  companyFilter: string = '';
  companySortField: 'name' | 'sector' | 'emissions' = 'name';
  companySortDirection: 'asc' | 'desc' = 'asc';
  emissionSortField: 'type' | 'amount' | 'co2e' | 'date' = 'date';
  emissionSortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private companyService: CompanyService,
    private emissionService: EmissionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.viewCompanies();
  }

  onCompanySelected(company: Company): void {
    // Solo procesar la selección si no estamos en modo edición
    if (this.currentView === 'companyForm') return;

    this.selectedCompany = company;
    // Cargamos emisiones y nos aseguramos de que estamos en la vista "companies"
    this.emissionService.getEmissionsByCompany(company.id).subscribe({
      next: (data) => {
        this.allEmissions = [...data];
        this.applyEmissionSort();
        this.currentView = 'companies';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al obtener emisiones de la empresa seleccionada:', err)
    });
  }

  // Cuando el hijo emite que ha habido resultado y debe volver al listado
  onGoBackToList(): void {
    // Volvemos a la pantalla principal de empresas
    this.currentView = 'companies';

    // Si hay una empresa seleccionada, recargamos sus emisiones para que se vean inmediatamente
    if (this.selectedCompany) {
      this.viewCompanyEmissions(this.selectedCompany);
    } else {
      // Si no hay empresa seleccionada, recargamos listado de empresas para mantener consistencia
      this.viewCompanies();
    }
  }

  onEmissionAdded(): void {
    // Si venimos desde el formulario de añadir emisión y había una empresa seleccionada,
    // recargamos sus emisiones y mostramos la vista de empresas (con sus emisiones).
    if (this.selectedCompany) {
      this.emissionService.getEmissionsByCompany(this.selectedCompany.id).subscribe({
        next: (data) => {
          this.allEmissions = [...data];
          this.applyEmissionSort();
          this.currentView = 'companies';
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error recargando emisiones tras añadir:', err)
      });
    } else {
      // Fallback: recargar todas las emisiones
      this.emissionService.getAllEmissions().subscribe({
        next: (data) => {
          this.allEmissions = [...data];
          this.applyEmissionSort();
          this.currentView = 'emissions';
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error recargando emisiones globales:', err)
      });
    }
  }

  // Maneja finalización de operaciones sobre empresas (crear/editar/cancelar)
  onCompanyOperationCompleted(): void {
    this.currentView = 'companies';
    this.editingCompany = null;

    // Forzamos recarga de empresas para asegurar sincronía
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies = [...data];
        this.applyCompanySort();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error recargando empresas:', err)
    });
  }

  sortCompanies(field: 'name' | 'sector' | 'emissions'): void {
    if (this.companySortField === field) {
      this.companySortDirection = this.companySortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.companySortField = field;
      this.companySortDirection = 'asc';
    }
    this.applyCompanySort();
  }

  applyCompanySort(): void {
    this.companies.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (this.companySortField) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'sector':
          valueA = a.sector.toLowerCase();
          valueB = b.sector.toLowerCase();
          break;
        case 'emissions':
          valueA = a.id;
          valueB = b.id;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return this.companySortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.companySortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  sortEmissions(field: 'type' | 'amount' | 'co2e' | 'date'): void {
    if (this.emissionSortField === field) {
      this.emissionSortDirection = this.emissionSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.emissionSortField = field;
      this.emissionSortDirection = 'asc';
    }
    this.applyEmissionSort();
  }

  applyEmissionSort(): void {
    this.allEmissions.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (this.emissionSortField) {
        case 'type':
          valueA = a.type.toLowerCase();
          valueB = b.type.toLowerCase();
          break;
        case 'amount':
          valueA = a.amount;
          valueB = b.amount;
          break;
        case 'co2e':
          valueA = a.co2e;
          valueB = b.co2e;
          break;
        case 'date':
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return this.emissionSortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.emissionSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  viewCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies = [...data];
        this.applyCompanySort();
        this.currentView = 'companies';
        this.selectedCompany = null;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando empresas:', err)
    });
  }

  viewAllEmissions(): void {
    this.emissionService.getAllEmissions().subscribe({
      next: (data) => {
        this.allEmissions = [...data];
        this.applyEmissionSort();
        this.currentView = 'emissions';
        this.selectedCompany = null;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando todas las emisiones:', err)
    });
  }

  editCompany(company: Company): void {
    if (!company) return;
    this.editingCompany = { ...company };
    this.currentView = 'companyForm';
    this.selectedCompany = null; // evitar interferencias con selección
    // Forzamos cambio de vista inmediatamente
    this.cdr.detectChanges();
  }

  deleteCompany(company: Company): void {
    if (!company || !company.id) {
      console.warn('No se puede eliminar: empresa inválida');
      return;
    }

    if (!confirm(`¿Eliminar la empresa "${company.name}"?`)) return;

    this.companyService.deleteCompany(company.id).subscribe({
      next: () => {
        if (this.selectedCompany?.id === company.id) {
          this.selectedCompany = null;
          this.allEmissions = [];
        }
        this.viewCompanies();
      },
      error: (err) => console.error('Error al eliminar empresa:', err)
    });
  }

  addEmission(company: Company): void {
    if (!company) return;
    this.selectedCompany = company;
    this.currentView = 'emissionForm';
    this.cdr.detectChanges();
  }

  viewCompanyEmissions(company: Company): void {
    if (!company) return;
    this.selectedCompany = company;
    this.emissionService.getEmissionsByCompany(company.id).subscribe({
      next: (data) => {
        this.allEmissions = [...data];
        this.applyEmissionSort();
        this.currentView = 'companies';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar emisiones:', err)
    });
  }

  deleteEmission(emissionId: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar esta emisión?')) return;

    this.emissionService.deleteEmission(emissionId).subscribe({
      next: () => {
        this.allEmissions = this.allEmissions.filter(e => e.id !== emissionId);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al eliminar emisión:', err)
    });
  }

  onCompanyFormSubmit(companyData: any): void {
    if (this.editingCompany) {
      this.companyService.updateCompany(this.editingCompany.id, companyData).subscribe({
        next: () => this.onCompanyOperationCompleted(),
        error: (err) => console.error('Error al actualizar empresa:', err)
      });
    } else {
      this.companyService.createCompany(companyData).subscribe({
        next: () => this.onCompanyOperationCompleted(),
        error: (err) => console.error('Error al crear empresa:', err)
      });
    }
  }

showAddCompanyForm(): void {
  this.currentView = 'companyForm';
  this.editingCompany = null;   // formulario vacío
}

showAddEmissionForm(): void {
  this.currentView = 'emissionForm';
  this.selectedCompany = null;  // aparece con desplegable de empresas
}

exportEmissionsToCSV(company: Company): void {
  if (!company) return;

  // Pedimos al servicio las emisiones de esta empresa
  this.emissionService.getEmissionsByCompany(company.id).subscribe({
    next: (emissions) => {
      if (!emissions.length) {
        alert(`La empresa "${company.name}" no tiene emisiones para exportar.`);
        return;
      }

      const headers = ['Tipo', 'Cantidad (kWh)', 'CO2e (kg)', 'Fecha'];
      const rows = emissions.map(e => [
        e.type,
        e.amount,
        e.co2e,
        new Date(e.date).toLocaleDateString()
      ]);

      const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${company.name}_emissions.csv`);
      link.click();
      URL.revokeObjectURL(url);
    },
    error: (err) => console.error('Error al obtener emisiones para exportar:', err)
  });
}



}
