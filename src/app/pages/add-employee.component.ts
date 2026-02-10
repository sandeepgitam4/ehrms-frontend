import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Add New Employee</h2>
      </div>
      
      <div class="form-card">
        <form (ngSubmit)="onSubmit()" #empForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" [(ngModel)]="employee.full_name" name="full_name" required placeholder="Enter full name">
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="employee.email" name="email" required placeholder="Enter email address">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Department *</label>
              <select [(ngModel)]="employee.department" name="department" required>
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          <div *ngIf="error" class="error">{{error}}</div>

          <div class="actions">
            <button type="submit" class="btn-primary" [disabled]="!empForm.valid || loading">
              {{loading ? 'Saving...' : 'Save Employee'}}
            </button>
            <button type="button" class="btn-secondary" (click)="cancel()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 30px; max-width: 900px; margin: 0 auto; }
    .page-header h2 { font-size: 28px; color: #2c3e50; font-weight: 700; margin-bottom: 30px; }
    
    .form-card { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .form-group { display: flex; flex-direction: column; }
    label { margin-bottom: 8px; font-weight: 600; color: #495057; font-size: 14px; }
    input { padding: 12px 16px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: all 0.3s; }
    input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    select { padding: 12px 16px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: all 0.3s; background: white; cursor: pointer; }
    select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    
    .actions { display: flex; gap: 15px; margin-top: 30px; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px; transition: transform 0.2s; }
    .btn-primary:hover:not(:disabled) { transform: scale(1.05); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .btn-secondary { background: #6c757d; color: white; padding: 14px 32px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px; transition: all 0.2s; }
    .btn-secondary:hover { background: #5a6268; }
    
    .error { color: #dc3545; margin: 20px 0; padding: 12px; background: #f8d7da; border-radius: 6px; }

    @media (max-width: 768px) {
      .container { padding: 15px; }
      .page-header h2 { font-size: 24px; margin-bottom: 20px; }
      .form-card { padding: 20px; }
      .form-row { grid-template-columns: 1fr; gap: 15px; }
      .actions { flex-direction: column; }
      .btn-primary, .btn-secondary { width: 100%; padding: 12px; }
    }
  `]
})
export class AddEmployeeComponent {
  employee: Employee = {
    full_name: '',
    email: '',
    department: ''
  };
  loading = false;
  error = '';

  constructor(private apiService: ApiService, private router: Router, private toastService: ToastService) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.apiService.createEmployee(this.employee).subscribe({
      next: () => {
        this.toastService.success('Employee created successfully!');
        this.router.navigate(['/employees']);
      },
      error: (err: any) => {
        this.toastService.error('Failed to create employee');
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
