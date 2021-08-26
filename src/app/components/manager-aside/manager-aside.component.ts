import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ManagerDataObject} from '../../entities/managerDataObject';
import {EventsService} from '../../services/events.service';
import {ManagerDataHandlerService} from '../../services/manager-data-handler.service';

@Component({
  selector: 'app-manager-aside',
  templateUrl: './manager-aside.component.html',
  styleUrls: ['./manager-aside.component.css']
})
export class ManagerAsideComponent implements OnInit {
  @Input() public tab: string = 'queries';
  @Input() public dataCollection: ManagerDataObject[] = [];
  @Input() public isSavedToasterOn: boolean = false;

  @Output() public onSelect: EventEmitter<ManagerDataObject> = new EventEmitter<ManagerDataObject>();

  public selectedItem: ManagerDataObject;
  public tempRecordId: number = 0;

  constructor(private managerDataHandlerService: ManagerDataHandlerService, private eventsService: EventsService) { }

  ngOnInit(): void {

  }

  public deleteRecord(id: number): void {
    if (id < 0) {
      this.eventsService.recordDeleted.emit(id);
    } else if (id > 0) {
      this.managerDataHandlerService.deleteById(this.tab, id)
        .subscribe((data) => {
            console.log(data, ' Item deleted successfully');
            this.eventsService.recordDeleted.emit(id);
          }, error => console.log(error));
    }
  }

  public createNewTempRecord(): void {
    this.tempRecordId -= 1;
    const record = new ManagerDataObject(this.tempRecordId, `Новая запись`, '', new Date(), 'New');
    this.selectedItem = record;
    this.onSelect.emit(record);
    this.dataCollection?.push(record);
  }

  public onListItemClick(record: ManagerDataObject): void {
    this.selectedItem = record;
    this.onSelect.emit(record);
  }

}
