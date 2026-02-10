import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';
import { Employee } from '../models/employee.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Employee Management</h2>
        <button class="btn-primary" routerLink="/add-employee">
          <span class="btn-icon">➕</span>
          Add Employee
        </button>
      </div>

      <div *ngIf="loading" class="loading">Loading...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      
      <div class="table-container" *ngIf="!loading && employees.length > 0">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of employees">
              <td><strong>{{emp.employee_id}}</strong></td>
              <td>{{emp.full_name}}</td>
              <td>{{emp.email}}</td>
              <td><span class="badge">{{emp.department}}</span></td>
              <td>
                <button class="btn-danger" (click)="deleteEmployee(emp.employee_id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && employees.length === 0" class="empty">
        <div class="empty-icon">📋</div>
        <p>No employees found. Add your first employee!</p>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
    .page-header h2 { font-size: 28px; color: #2c3e50; font-weight: 700; }
    
    .table-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th, td { padding: 16px; text-align: left; }
    th { background: #f8f9fa; font-weight: 600; color: #495057; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }
    tbody tr:hover { background: #f8f9fa; }
    
    .badge { background: #e3f2fd; color: #1976d2; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; white-space: nowrap; }
    
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: transform 0.2s; white-space: nowrap; }
    .btn-primary:hover { transform: scale(1.05); }
    .btn-icon { font-size: 16px; }
    
    .btn-danger { background: #dc3545; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; white-space: nowrap; }
    .btn-danger:hover { background: #c82333; transform: scale(1.05); }
    
    .loading, .error, .empty { padding: 60px 20px; text-align: center; background: white; border-radius: 12px; margin-top: 20px; }
    .error { color: #dc3545; }
    .empty-icon { font-size: 64px; margin-bottom: 20px; }
    .empty p { color: #666; font-size: 16px; }

    @media (max-width: 768px) {
      .container { padding: 15px; }
      .page-header { flex-direction: column; align-items: stretch; }
      .page-header h2 { font-size: 24px; }
      .btn-primary { width: 100%; justify-content: center; }
      .table-container { border-radius: 8px; }
      th, td { padding: 12px 8px; font-size: 14px; }
      .badge { font-size: 12px; padding: 4px 8px; }
      .btn-danger { padding: 6px 12px; font-size: 14px; }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error = '';

  constructor(private apiService: ApiService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.apiService.getEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.toastService.error('Failed to load employees');
        this.loading = false;
      }
    });
  }

  deleteEmployee(id: string | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apiService.deleteEmployee(id).subscribe({
        next: () => {
          this.toastService.success('Employee deleted successfully!');
          this.loadEmployees();
        },
        error: () => this.toastService.error('Failed to delete employee')
      });
    }
  }
}
