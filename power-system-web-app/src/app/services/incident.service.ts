import { IncidentMapDisplay } from './../shared/models/incident-map-display.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Incident } from 'app/shared/models/incident.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Device } from 'app/shared/models/device.model';
import { Crew } from 'app/shared/models/crew.model';
import { Call } from 'app/shared/models/call.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor(private http: HttpClient) { }

  getAllIncidents():Observable<Incident[]>{
    let requestUrl = environment.serverURL.concat("incidents");
    return this.http.get<Incident[]>(requestUrl);
  }

  getIncidentById(id:number):Observable<Incident>{
    let requestUrl = environment.serverURL.concat(`incidents/${id}`);
    return this.http.get<Incident>(requestUrl);
  }

  createNewIncident(incident:Incident):Observable<Incident>{
    console.log(incident)
    let requestUrl = environment.serverURL.concat("incidents");
    return this.http.post<Incident>(requestUrl, incident);
  }

  updateIncident(incident: Incident):Observable<Incident>{
    let requestUrl = environment.serverURL.concat(`incidents/${incident.id}`);
    return this.http.put<Incident>(requestUrl, incident);
  }

  deleteIncident(id:number):Observable<{}>{
    let requestUrl = environment.serverURL.concat(`incidents/${id}`);
    return this.http.delete(requestUrl);
  }

  
  getIncidentDevices(incidentId: number):Observable<Device[]>{
    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/devices`);
    return this.http.get<Device[]>(requestUrl);
  }

  getUnrelatedDevices(incidentId: number):Observable<Device[]>{
    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/unrelated-devices`);
    return this.http.get<Device[]>(requestUrl);
  }


  addDeviceToIncident(incidentId: number, deviceId: number):Observable<Incident>{
   
    let incident: Incident = new Incident();
    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/device/${deviceId}`);
    return this.http.post<Incident>(requestUrl, incident);                  /// proveriti
  }


  addCrewToIncident(incidentId: number, crewId: number):Observable<Incident>{
   
    let incident: Incident = new Incident();
    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/crew/${crewId}`);
    return this.http.put<Incident>(requestUrl, incident);                  /// proveriti
  }


  getIncidentCrew(incidentId:number):Observable<Crew>{
    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/crew`);
    return this.http.get<Crew>(requestUrl);
  }


  

  removeCrewFromIncidet(incidentId: number):Observable<Incident>{

    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/remove-crew`);
    return this.http.put<Incident>(requestUrl, "");  

  }



  removeDeviceFromIncident(incidentId: number, deviceId: number):Observable<Incident>{

    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/remove-device/device/${deviceId}`);
    return this.http.put<Incident>(requestUrl, "");  //////////// proveiti
  }


  getIncidentCalls(incidentId: number):Observable<Call[]>{
    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/calls`);
    return this.http.get<Call[]>(requestUrl);
  }


  addIncidentCall(incidentId: number, newCall: Call):Observable<Call>{
    
    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/calls`);
    return this.http.post<Call>(requestUrl, newCall);
  }

 
  //done
  getIncidentLocation(incidentId:number):Observable<Location>{
    let requestUrl = environment.serverURL.concat(`incidents/${incidentId}/location`);
    return this.http.get<Location>(requestUrl);
  }

  getUnassignedIncidents():Observable<Incident[]>{
    let requestUrl = environment.serverURL.concat(`incidents/unassigned`);
    return this.http.get<Incident[]>(requestUrl);
  }

  getUnresolvedIncidents():Observable<IncidentMapDisplay[]>{
    let requestUrl = environment.serverURL.concat(`incidents/unresolved`);
    return this.http.get<IncidentMapDisplay[]>(requestUrl);
  }
}
