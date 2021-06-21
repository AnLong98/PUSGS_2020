import { Component, Input, OnInit } from '@angular/core';
import { DisplayService } from 'app/services/display.service';
import { Notification } from 'app/shared/models/notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @Input() notificationType: string;
  @Input() notification:Notification;

  constructor(public display:DisplayService) { }

  ngOnInit(): void {
    console.log("Tip je:" + this.notificationType)
  }

}
