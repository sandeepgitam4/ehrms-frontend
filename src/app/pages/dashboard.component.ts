import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <h2>Dashboard</h2>
      
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-value">{{totalEmployees}}</div>
            <div class="stat-label">Total Employees</div>
          </div>
        </div>

        <div class="stat-card green">
          <div class="stat-icon">✓</div>
          <div class="stat-content">
            <div class="stat-value">{{presentToday}}</div>
            <div class="stat-label">Present Today</div>
          </div>
        </div>

        <div class="stat-card red">
          <div class="stat-icon">✗</div>
          <div class="stat-content">
            <div class="stat-value">{{absentToday}}</div>
            <div class="stat-label">Absent Today</div>
          </div>
        </div>

        <div class="stat-card purple">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{attendanceRate}}%</div>
            <div class="stat-label">Attendance Rate</div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <p class="description">
          <strong>HRMS Lite</strong> is a comprehensive employee management system designed to streamline your HR operations. 
          Easily manage employee records, track daily attendance, and gain insights through real-time analytics. 
          <br><br>
          <strong>Key Features:</strong>
          <br>• Add and manage employee profiles with auto-generated IDs
          <br>• Mark daily attendance with Present/Absent status
          <br>• View attendance history and workforce statistics
          <br>• Monitor attendance rates and employee presence in real-time
          <br>• Department-wise employee organization
        </p>
        <div class="action-buttons">
          <button routerLink="/add-employee" class="action-btn">
            <span class="btn-icon">➕</span>
            Add Employee
          </button>
          <button routerLink="/attendance" class="action-btn">
            <span class="btn-icon">📝</span>
            Mark Attendance
          </button>
          <button routerLink="/employees" class="action-btn">
            <span class="btn-icon">👤</span>
            View Employees
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 20px; max-width: 1200px; margin: 0 auto; }
    h2 { font-size: 28px; margin-bottom: 30px; color: #2c3e50; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
    
    .stat-card { background: white; border-radius: 12px; padding: 25px; display: flex; align-items: center; gap: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    
    .stat-icon { font-size: 40px; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0; }
    .blue .stat-icon { background: #e3f2fd; }
    .green .stat-icon { background: #e8f5e9; }
    .red .stat-icon { background: #ffebee; }
    .purple .stat-icon { background: #f3e5f5; }
    
    .stat-content { flex: 1; min-width: 0; }
    .stat-value { font-size: 32px; font-weight: 700; margin-bottom: 5px; }
    .blue .stat-value { color: #1976d2; }
    .green .stat-value { color: #388e3c; }
    .red .stat-value { color: #d32f2f; }
    .purple .stat-value { color: #7b1fa2; }
    
    .stat-label { font-size: 14px; color: #666; font-weight: 500; }
    
    .quick-actions { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h3 { font-size: 20px; margin-bottom: 20px; color: #2c3e50; }
    .description { color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 25px; }
    
    .action-buttons { display: flex; gap: 15px; flex-wrap: wrap; }
    .action-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.3s; }
    .action-btn:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    .btn-icon { font-size: 20px; }

    @media (max-width: 768px) {
      .dashboard { padding: 15px; }
      h2 { font-size: 24px; margin-bottom: 20px; }
      .stats-grid { grid-template-columns: 1fr; gap: 15px; margin-bottom: 30px; }
      .stat-card { padding: 20px; }
      .stat-icon { width: 60px; height: 60px; font-size: 32px; }
      .stat-value { font-size: 28px; }
      .quick-actions { padding: 20px; }
      .action-buttons { flex-direction: column; }
      .action-btn { width: 100%; justify-content: center; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalEmployees = 0;
  presentToday = 0;
  absentToday = 0;
  attendanceRate = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    const today = new Date().toISOString().split('T')[0];
    
    this.apiService.getEmployees().subscribe({
      next: (employees) => {
        this.totalEmployees = employees.length;
      }
    });

    this.apiService.getAllAttendance().subscribe({
      next: (attendance) => {
        const todayAttendance = attendance.filter(a => a.date === today);
        this.presentToday = todayAttendance.filter(a => a.status === 'Present').length;
        this.absentToday = todayAttendance.filter(a => a.status === 'Absent').length;
        
        if (todayAttendance.length > 0) {
          this.attendanceRate = Math.round((this.presentToday / todayAttendance.length) * 100);
        }
      }
    });
  }
}
