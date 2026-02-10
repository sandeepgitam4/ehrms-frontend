import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { EmployeeListComponent } from './pages/employee-list.component';
import { AddEmployeeComponent } from './pages/add-employee.component';
import { AttendanceComponent } from './pages/attendance.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'add-employee', component: AddEmployeeComponent },
  { path: 'attendance', component: AttendanceComponent }
];
