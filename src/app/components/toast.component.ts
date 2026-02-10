import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngIf="show" [class]="'toast toast-' + type" [@slideIn]>
        <div class="toast-icon">
          <span *ngIf="type === 'success'">✓</span>
          <span *ngIf="type === 'error'">✗</span>
          <span *ngIf="type === 'info'">ℹ</span>
        </div>
        <div class="toast-message">{{message}}</div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; }
    .toast { display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 300px; animation: slideIn 0.3s ease-out; }
    .toast-success { background: #d4edda; border-left: 4px solid #28a745; color: #155724; }
    .toast-error { background: #f8d7da; border-left: 4px solid #dc3545; color: #721c24; }
    .toast-info { background: #d1ecf1; border-left: 4px solid #17a2b8; color: #0c5460; }
    .toast-icon { font-size: 24px; font-weight: bold; }
    .toast-message { flex: 1; font-weight: 500; }
    @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    @media (max-width: 768px) {
      .toast-container { top: 10px; right: 10px; left: 10px; }
      .toast { min-width: auto; padding: 12px 16px; font-size: 14px; }
      .toast-icon { font-size: 20px; }
    }
  `]
})
export class ToastComponent implements OnInit {
  show = false;
  message = '';
  type: 'success' | 'error' | 'info' = 'info';

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe(toast => {
      this.message = toast.message;
      this.type = toast.type;
      this.show = true;
      setTimeout(() => this.show = false, 3000);
    });
  }
}
