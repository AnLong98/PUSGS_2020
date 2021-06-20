
import { Device } from 'app/shared/models/device.model';
import { WorkPlan } from 'app/shared/models/work-plan.model'
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateChange } from './../shared/models/state-change.model';
import { IMultimediaService } from 'app/shared/interfaces/multimedia-service';
import { MultimediaAttachment } from 'app/shared/models/multimedia-attachment.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { WorkPlanList } from 'app/shared/models/work-plan-list.model';
import { Instruction } from 'app/shared/models/instruction.model';

@Injectable({
  providedIn: 'root'
})
export class WorkPlanService implements IMultimediaService {

  constructor(private http: HttpClient) { }

  downloadAttachment(wrId: number, filename: string): Observable<any> {
    let requestUrl = environment.serverURL.concat(`work-plans/${wrId}/attachments/${filename}`);
		return this.http.get(requestUrl, {responseType: 'blob'});
  }
  getAttachments(wrId: number): Observable<MultimediaAttachment[]> {
    let requestUrl = environment.serverURL.concat(`work-plans/${wrId}/attachments`);
		return this.http.get<MultimediaAttachment[]>(requestUrl);
  }
  uploadAttachment(file: File, workPlanId: number): Observable<HttpEvent<any>> {
    let requestUrl = environment.serverURL.concat(`work-plans/${workPlanId}/attachments`);
    const formData: FormData = new FormData();

    formData.append('file', file);

    const request = new HttpRequest('POST', requestUrl, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(request);
  }
  deleteAttachment(filename: string, documentId: number): Observable<any> {
    let requestUrl = environment.serverURL.concat(`work-plans/${documentId}/attachments/${filename}`);
    return this.http.delete(requestUrl);
  }

  createWorkPlan(workPlan:WorkPlan):Observable<WorkPlan>{
    let requestUrl = environment.serverURL.concat("work-plans");
    return this.http.post<WorkPlan>(requestUrl, workPlan);
  }

  getById(id:number):Observable<WorkPlan>{
    let requestUrl = environment.serverURL.concat(`work-plans/${id}`);
    return this.http.get<WorkPlan>(requestUrl);
  }  
  getAll():Observable<WorkPlan[]>{
    let requestUrl = environment.serverURL.concat(`work-plans/all`);
    return this.http.get<WorkPlan[]>(requestUrl);
  }

  getWorkplansPaged( page: number, perPage:number,sort?: string, order?: string, documentStatus?:string, searchParam?:string, documentOwner?:string):Observable<WorkPlanList>{
    let requestUrl = environment.serverURL.concat("work-plans");
    let params = new HttpParams();
    if(sort)
      params = params.append('sortBy', sort);
    if(order)
      params = params.append('direction', order);
    params = params.append('page', page.toString());
    params = params.append('perPage', perPage.toString());
    if(searchParam)
      params = params.append('searchParam', searchParam);
    if(documentOwner)
      params = params.append('owner', documentOwner);
    if(documentStatus)
      params = params.append('status', documentStatus);
    return this.http.get<WorkPlanList>(requestUrl, {params:params});
  }

  getWorkPlanDevices(id:number):Observable<Device[]>{
    let requestUrl = environment.serverURL.concat(`work-plans/${id}/devices`);
    return this.http.get<Device[]>(requestUrl);
  }

  updateWorkPlan(workPlan:WorkPlan):Observable<WorkPlan>{
    let requestUrl = environment.serverURL.concat(`work-plans/${workPlan.id}`);
    return this.http.put<WorkPlan>(requestUrl, workPlan);
  }

  deleteWorkPlan(id:number):Observable<{}>{
    let requestUrl = environment.serverURL.concat(`work-plans/${id}`);
    return this.http.delete<WorkPlan>(requestUrl);
  }

  getStateChanges(wrId:number): Observable<StateChange[]> {
    let requestUrl = environment.serverURL.concat(`work-plans/${wrId}/state-changes`);
		return this.http.get<StateChange[]>(requestUrl);
  }

  approveWorkPlan(wrId:number): Observable<WorkPlan> {
    let requestUrl = environment.serverURL.concat(`work-plans/${wrId}/approve`);
		return this.http.put<WorkPlan>(requestUrl, {});
  }
    
  denyWorkPlan(wrId:number): Observable<WorkPlan> {
    let requestUrl = environment.serverURL.concat(`work-plans/${wrId}/deny`);
		return this.http.put<WorkPlan>(requestUrl, {});
  }

  cancelWorkPlan(wrId:number): Observable<WorkPlan> {
    let requestUrl = environment.serverURL.concat(`work-plans/${wrId}/cancel`);
		return this.http.put<WorkPlan>(requestUrl, {});
  }

  getInstructions(wrId:number): Observable<Instruction[]> {
    let requestUrl = environment.serverURL.concat(`work-plans/${wrId}/instructions`);
		return this.http.get<Instruction[]>(requestUrl);
  }

  approveInstruction(id:number, wpId:number): Observable<Instruction> {
    let requestUrl = environment.serverURL.concat(`work-plans/${wpId}/approve-instruction/${id}`);
		return this.http.put<Instruction>(requestUrl, {});
  }

  deleteInstruction(id:number, wpId:number):Observable<{}>{
    let requestUrl = environment.serverURL.concat(`work-plans/${wpId}/instructions/${id}`);
    return this.http.delete<Instruction>(requestUrl);
  }

  deleteInstructions(wpId:number):Observable<{}>{
    let requestUrl = environment.serverURL.concat(`work-plans/${wpId}/instructions`);
    return this.http.delete<Instruction>(requestUrl);
  }

  addInstruction(instruction:Instruction):Observable<Instruction>{
    let requestUrl = environment.serverURL.concat(`work-plans/add-instruction`);
    return this.http.post<Instruction>(requestUrl, instruction);
  }

}
