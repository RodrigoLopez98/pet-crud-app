// src/app/components/notification/notification.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { LucideAngularModule, CircleCheck, CircleX, Info, X } from 'lucide-angular';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) { }

  protected readonly CircleCheck = CircleCheck;
  protected readonly CircleX = CircleX;
  protected readonly Info = Info;
  protected readonly X = X;

  remove(id: string): void {
    this.notificationService.remove(id);
  }

  getIcon(type: string): typeof CircleCheck | typeof CircleX | typeof Info {
    switch (type) {
      case 'success':
        return CircleCheck;
      case 'error':
        return CircleX;
      default:
        return Info;
    }
  }
}

