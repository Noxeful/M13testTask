import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {ManagerDataObject} from "../../entities/managerDataObject";
import {EventsService} from "../../services/events.service";
import {ManagerDataHandlerService} from "../../services/manager-data-handler.service";
import {error} from "@angular/compiler/src/util";

@Component({
  selector: 'app-manager-aside',
  templateUrl: './manager-aside.component.html',
  styleUrls: ['./manager-aside.component.css']
})
export class ManagerAsideComponent implements OnInit {
  @Input() public tab: string = 'queries';

  // @Input() public dataCollection: ManagerDataObject[] = [new ManagerDataObject(1, 'Какой то вменяемый но оч длинный запрос', 'kek1', new Date(), 'New'), new ManagerDataObject(2, 'какой то там запрос', 'kek2', new Date(), 'Saved'), new ManagerDataObject(3, 'какой то там еще запрос', 'kek3', new Date(), 'Changed')];
  @Input() public dataCollection: ManagerDataObject[] = [];

  public tempRecordId: number = 0;

  constructor(private managerDataHandlerService: ManagerDataHandlerService, private eventsService: EventsService, private renderer: Renderer2) { }

  ngOnInit(): void {


  }

  public deleteRecord(id: number): void {
    this.managerDataHandlerService.deleteById(this.tab, id)
      .subscribe((data) => {
          console.log(data, ' Item deleted successfully');
          this.eventsService.recordDeleted.emit(id);
        },
        error => console.log(error)
      );
  }

  public createNewTempRecord(): void {
    this.tempRecordId -= 1;
    const record = new ManagerDataObject(this.tempRecordId, `Новая запись`, '', new Date(), 'New');
    this.eventsService.tempRecordCreated.emit(record);
    this.dataCollection?.push(record);
  }

  public onListItemClick(record: ManagerDataObject): void {
    this.eventsService.recordFocused.emit(record);
  }

}
