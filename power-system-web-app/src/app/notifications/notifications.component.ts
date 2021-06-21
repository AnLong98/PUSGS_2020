import { Component, OnInit } from '@angular/core';
import { DisplayService } from 'app/services/display.service';
import { NotificationService } from 'app/services/notification.service';
import { Notification } from 'app/shared/models/notification.model';
import { ToastrService } from 'ngx-toastr';
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers: [MessageService]
})

export class NotificationsComponent implements OnInit {

  notificationTypes = [
    { name: 'ALL', color: '' },
    { name: 'UNREAD', color: '' },
    { name: 'INFO', color: "info" },
    { name: 'ERROR', color: 'cancel' },
    { name: 'SUCCESS', color: 'check_circle' },
    { name: 'WARNING', color: 'warning' },
  ];

  notificationType:string;
  notifications:Notification[];
  shownNotifications:Notification[];

  public filterData: any = {};
  public resultData = [];

  dates = ['21.06.2021'];
  constructor(private messageService: MessageService, private toastr:ToastrService, private notificationService:NotificationService) 
  {
  }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications()
  {
    this.notificationService.getAll().subscribe(
      data => {
        this.notifications = data;
        this.shownNotifications = data;
      }, 
      error => {
        if(error.error instanceof ProgressEvent)
        {
          this.loadNotifications();
        }
        else{
          this.toastr.error(error.error);
        }
      }
    )
  }

  showNotifications(notificationType:string)
  {
    this.notificationType = this.notificationType;
    console.log(notificationType);
    if(notificationType === "ALL")
    {
      this.notifications = this.shownNotifications;
    }
    else if(notificationType === "UNREAD")
    {
      this.notifications = this.shownNotifications.filter(i=> i.notificationType == notificationType);
    }
    else if(notificationType === "ERROR")
    {
      this.notifications = this.shownNotifications.filter(i=> i.notificationType == notificationType);
    }
    else if(notificationType === "SUCCESS")
    {
      this.notifications = this.shownNotifications.filter(i=> i.notificationType == notificationType);
    }
    else if(notificationType === "INFO")
    {
      this.notifications = this.shownNotifications.filter(i=> i.notificationType == notificationType);
    }
    else if(notificationType === "WARNING")
    {
      this.notifications = this.shownNotifications.filter(i=> i.notificationType == notificationType);
    }
  }

  markAllAsRead()
  {/*
    this.notificationService.MarkAllAsRead(this.notifications).subscribe(
      data => {
        this.toastr.success("Successfully marked all notification as read.", "", {positionClass: 'toast-bottom-left'})
      }, 
      error => {
        this.toastr.error(error.error);
      }
    );*/
  }
  deleteAll(){
    this.notificationService.deleteAll().subscribe(
      data => {
        this.toastr.success("Successfully deleted all notification as read.", "", {positionClass: 'toast-bottom-left'});
      },
      error => {
        this.toastr.error(error.error);
      }
    )
  }
  
}
