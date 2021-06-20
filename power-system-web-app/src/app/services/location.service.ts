import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from 'app/shared/models/location.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }
  
  getAllLocations():Observable<Location[]>{
    let requestUrl = environment.serverURL.concat("locations");
    return this.http.get<Location[]>(requestUrl);
  }

  changePriorities(dataSource:any):Observable<any>{
    let requestUrl = environment.serverURL.concat('locations/streets-priorities');
    return this.http.post<any>(requestUrl, dataSource);
  }
}
