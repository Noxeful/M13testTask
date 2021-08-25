import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ManagerDataObject} from "../entities/managerDataObject";

const baseUrl: string = 'https://612355aad446280017054b15.mockapi.io/api';

@Injectable({
  providedIn: 'root'
})
export class ManagerDataHandlerService {

  constructor(private http: HttpClient) { }

  public createEntity(name: string, data: ManagerDataObject): Observable<any> {
    return this.http.post(`${baseUrl}/${name}`, data);
  }

  public getAllEntities(name: string): Observable<any> {
    return this.http.get(`${baseUrl}/${name}`);
  }

  public deleteById(name: string, id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/${name}/${id}`);
  }

  public updateById(name: string, id: number, record: ManagerDataObject): Observable<any> {
    return this.http.put(`${baseUrl}/${name}/${id}`, record);
  }

}
