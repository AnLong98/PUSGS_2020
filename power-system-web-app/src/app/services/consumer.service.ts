import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsumerList } from 'app/shared/models/consumer-list.model';
import { Consumer } from 'app/shared/models/consumer.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {

  constructor(private http: HttpClient) { }

  GetConsumers():Observable<Consumer[]>{
    let requestUrl = environment.serverURL.concat("consumers/all");
    return this.http.get<Consumer[]>(requestUrl);
  }

  getConsumersPaged( page: number, perPage:number,sort?: string, order?: string, accountType?:string, searchParam?:string):Observable<ConsumerList>{
    let requestUrl = environment.serverURL.concat("consumers");
    let params = new HttpParams();
    if(sort)
      params = params.append('sortBy', sort);
    if(order)
      params = params.append('direction', order);
    params = params.append('page', page.toString());
    params = params.append('perPage', perPage.toString());
    if(searchParam)
      params = params.append('searchParam', searchParam);
    if(accountType)
      params = params.append('type', accountType);
    return this.http.get<ConsumerList>(requestUrl, {params:params});
  }

  getById(id:number):Observable<Consumer>{
    let requestUrl = environment.serverURL.concat(`consumers/${id}`);
    return this.http.get<Consumer>(requestUrl);
  }
/*
  createConsumer(consumer:Consumer):Observable<Consumer>{
    let requestUrl = environment.serverURL.concat("consumers");
    return this.http.post<Consumer>(requestUrl, consumer);
  }
*/
  updateConsumer(consumer:Consumer):Observable<Consumer>{
    let requestUrl = environment.serverURL.concat(`consumers/${consumer.id}`);
    return this.http.put<Consumer>(requestUrl, consumer);
  }

  createConsumer(name:string, lastname:string,locationID:number,accountID:string, accountType:string, phone:string):Observable<any>{
    let requestUrl = environment.serverURL.concat("consumers/add");
    let params = new HttpParams();
    params = params.append('name', name);
    params = params.append('lastname', lastname);
    params = params.append('locationID', locationID.toString());
    params = params.append('accountID', accountID);
    params = params.append('accountType', accountType);
    params = params.append('phone', phone);
    return this.http.get<any>(requestUrl, {params: params});
  }
  
  deleteConsumer(id:number):Observable<{}>{
    let requestUrl = environment.serverURL.concat(`consumers/${id}`);
    return this.http.delete(requestUrl);
  }

}
