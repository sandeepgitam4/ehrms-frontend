import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';
import { Employee, Attendance } from '../models/employee.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h2>Attendance Management</h2>
      </div>

      <div class="form-section">
        <h3>📝 Mark Attendance</h3>
        <form (ngSubmit)="markAttendance()" class="attendance-form">
          <div class="form-row">
            <div class="form-group">
              <label>Employee *</label>
              <select [(ngModel)]="attendance.employee_id" name="employee_id" required>
                <option value="">Select Employee</option>
                <option *ngFor="let emp of employees" [value]="emp.employee_id">
                  {{emp.employee_id}} - {{emp.full_name}}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Date *</label>
              <input type="date" [(ngModel)]="attendance.date" name="date" required>
            </div>

            <div class="form-group">
              <label>Status *</label>
              <select [(ngModel)]="attendance.status" name="status" required>
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn-primary">Mark Attendance</button>
        </form>
      </div>

      <div class="table-section">
        <div class="section-header">
          <h3>📊 All Attendance Records</h3>
          <button class="btn-refresh" (click)="loadAttendance()">↻ Refresh</button>
        </div>
        
        <div class="table-container" *ngIf="attendanceList.length > 0">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let att of attendanceList">
                <td><strong>{{att.employee_id}}</strong></td>
                <td>{{att.full_name}}</td>
                <td>{{att.date}}</td>
                <td>
                  <span [class]="att.status === 'Present' ? 'status-present' : 'status-absent'">
                    {{att.status}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="attendanceList.length === 0" class="empty">
          <div class="empty-icon">📋</div>
          <p>No attendance records found.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 30px; max-width: 1200px; margin: 0 auto; }
    .page-header h2 { font-size: 28px; color: #2c3e50; font-weight: 700; margin-bottom: 30px; }
    
    .form-section { background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .form-section h3 { font-size: 20px; margin-bottom: 20px; color: #2c3e50; }
    
    .attendance-form { }
    .form-row { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .form-group { display: flex; flex-direction: column; }
    label { margin-bottom: 8px; font-weight: 600; color: #495057; font-size: 14px; }
    input, select { padding: 12px 16px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: all 0.3s; }
    input:focus, select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 32px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: transform 0.2s; }
    .btn-primary:hover { transform: scale(1.05); }
    
    .table-section { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
    .section-header h3 { font-size: 20px; color: #2c3e50; margin: 0; }
    
    .btn-refresh { background: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; white-space: nowrap; }
    .btn-refresh:hover { background: #5a6268; }
    
    .table-container { overflow: hidden; border-radius: 8px; border: 1px solid #e9ecef; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 600px; }
    th, td { padding: 16px; text-align: left; }
    th { background: #f8f9fa; font-weight: 600; color: #495057; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }
    tbody tr:hover { background: #f8f9fa; }
    
    .status-present { background: #d4edda; color: #155724; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 13px; white-space: nowrap; }
    .status-absent { background: #f8d7da; color: #721c24; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 13px; white-space: nowrap; }
    
    .empty { padding: 60px 20px; text-align: center; }
    .empty-icon { font-size: 64px; margin-bottom: 20px; }
    .empty p { color: #666; font-size: 16px; }

    @media (max-width: 768px) {
      .container { padding: 15px; }
      .page-header h2 { font-size: 24px; margin-bottom: 20px; }
      .form-section, .table-section { padding: 20px; }
      .form-row { grid-template-columns: 1fr; gap: 15px; }
      .btn-primary { width: 100%; }
      .section-header { flex-direction: column; align-items: stretch; }
      .btn-refresh { width: 100%; }
      th, td { padding: 12px 8px; font-size: 14px; }
      .status-present, .status-absent { font-size: 12px; padding: 4px 12px; }
    }
  `]
})
export class AttendanceComponent implements OnInit {
  employees: Employee[] = [];
  attendanceList: Attendance[] = [];
  attendance: Attendance = {
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: ''
  };

  constructor(private apiService: ApiService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadAttendance();
  }

  loadEmployees() {
    this.apiService.getEmployees().subscribe({
      next: (data: Employee[]) => this.employees = data,
      error: () => this.toastService.error('Failed to load employees')
    });
  }

  loadAttendance() {
    this.apiService.getAllAttendance().subscribe({
      next: (data: Attendance[]) => this.attendanceList = data,
      error: () => this.toastService.error('Failed to load attendance')
    });
  }

  markAttendance() {
    this.apiService.markAttendance(this.attendance).subscribe({
      next: () => {
        this.toastService.success('Attendance marked successfully!');
        this.attendance = {
          employee_id: '',
          date: new Date().toISOString().split('T')[0],
          status: ''
        };
        this.loadAttendance();
      },
      error: () => this.toastService.error('Failed to mark attendance')
    });
  }
}
