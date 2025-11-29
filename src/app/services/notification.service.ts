// src/app/services/notification.service.ts
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  show(message: string, type: Notification['type'] = 'info', duration: number = 3000): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    this._notifications.update(notifications => [...notifications, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  success(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 4000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  remove(id: string): void {
    this._notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

