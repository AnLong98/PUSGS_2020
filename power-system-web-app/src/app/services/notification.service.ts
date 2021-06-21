import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from 'app/shared/models/notification.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getAll():Observable<Notification[]>{
    let requestUrl = environment.serverURL.concat("notifications/all");
    return this.http.get<Notification[]>(requestUrl);
  }

  deleteAll():Observable<{}>{
    let requestUrl = environment.serverURL.concat(`notifications`);
    return this.http.delete(requestUrl);
  }
}
