import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalVisibleSubject = new BehaviorSubject<boolean>(false);
  private modalContentSubject = new BehaviorSubject<any>(null);
  private modalTitleSubject = new BehaviorSubject<string>('');

  modalVisible$: Observable<boolean> = this.modalVisibleSubject.asObservable();
  modalContent$: Observable<any> = this.modalContentSubject.asObservable();
  modalTitle$: Observable<string> = this.modalTitleSubject.asObservable();

  openModal(title: string, content: any): void {
    this.modalTitleSubject.next(title);
    this.modalContentSubject.next(content);
    this.modalVisibleSubject.next(true);
  }

  closeModal(): void {
    this.modalVisibleSubject.next(false);
  }
}