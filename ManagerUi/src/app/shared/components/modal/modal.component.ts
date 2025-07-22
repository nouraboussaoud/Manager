import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="closeOnBackdrop($event)">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="close-btn" (click)="close()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      animation: fadeIn 0.2s ease-out;
    }
    
    .modal-container {
      background-color: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease-out;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 25px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #7f8c8d;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .close-btn:hover {
      color: #e74c3c;
      background-color: #f8f9fa;
    }
    
    .modal-body {
      padding: 25px;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(-30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ModalComponent implements OnInit {
  isVisible = false;
  title = '';
  content: TemplateRef<any> | null = null;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalVisible$.subscribe(visible => {
      this.isVisible = visible;
      if (visible) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    this.modalService.modalTitle$.subscribe(title => {
      this.title = title;
    });
    
    this.modalService.modalContent$.subscribe(content => {
      this.content = content;
    });
  }

  close(): void {
    this.modalService.closeModal();
  }

  closeOnBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }
}