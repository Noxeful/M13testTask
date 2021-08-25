import { EventEmitter, Injectable } from '@angular/core';
import {ManagerDataObject} from "../entities/managerDataObject";

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  public recordSaved = new EventEmitter<ManagerDataObject>();
  public recordDeleted = new EventEmitter<number>();
  public tempRecordCreated = new EventEmitter<ManagerDataObject>();
  public tempRecordSaved = new EventEmitter<number>();
  public recordFocused = new EventEmitter<ManagerDataObject>();

  constructor() { }
}
