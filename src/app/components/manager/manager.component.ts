import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {EventsService} from '../../services/events.service';
import {ManagerDataHandlerService} from '../../services/manager-data-handler.service';
import {ManagerDataObject} from '../../entities/managerDataObject';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css'],

})
export class ManagerComponent implements OnInit {

  public tab: string = 'queries';
  public recordCollection: ManagerDataObject[] = [];
  public selectedRecord: ManagerDataObject;
  public isSavedToasterOn: boolean = false;

  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private eventsService: EventsService,
              private managerDataHandlerService: ManagerDataHandlerService,
              private router: Router) { }

  ngOnInit(): void {
    this.eventsService.recordSaved
      .subscribe((data: ManagerDataObject) => {
          this.recordCollection?.push(data);
      },
        error => console.log(error)
      );

    this.eventsService.recordDeleted
      .subscribe((data) => {
          const record = this.recordCollection?.find((item) => item.id === data);
          if (record) {
            const recordIndex = this.recordCollection?.indexOf(record);
            this.recordCollection.splice(recordIndex, 1);
          }
      },
        error => console.log(error)
      );

    this.eventsService.tempRecordSaved
      .subscribe((data) => {
        const record = this.recordCollection.find((item) => item.id === data);
        if (record) {
          const recordtIndex = this.recordCollection.indexOf(record);
          this.recordCollection.splice(recordtIndex, 1);
        }

      }, error => console.log(error));

    this.eventsService.recordUpdated
      .subscribe((data) => {
        const record = this.recordCollection.find((item) => item.id === data.id);
        if (record) {
          const recordtIndex = this.recordCollection.indexOf(record);
          this.recordCollection.splice(recordtIndex, 1, data);
        }
      }, error => console.log(error));

    this.activatedRoute.paramMap
      .subscribe( (params: ParamMap) => {
        const param = params.get('tab');
        if (param) {
          const data: string = param.replace(':','');
          this.tab = data;
        }
        this.getAllEntities();
      }, error => console.log(error));

  }

  public getAllEntities(): void {
    this.managerDataHandlerService.getAllEntities(this.tab)
      .subscribe((data) => {
        this.recordCollection = data;
        console.log(data, ' :getAllEntities Result');
      },
        error => console.log(error)
      );
  }

  public createEntity(data: ManagerDataObject): void {
    this.managerDataHandlerService.createEntity(this.tab, data)
      .subscribe((data) => {
      console.log(data, ' :createEntity Result');
    },
        error => console.log(error)
      );
  }

  public openTab(tab: string): void  {
    this.router.navigate([`/manager/:${tab}/`]);
  }

  public onRecordSelect(record: ManagerDataObject): void {
    this.selectedRecord = record;
  }

  public onRecordChanged(data): void {
    if (this.selectedRecord.status !== 'Новый') {
      this.selectedRecord.status = 'Изменен';
    }
    this.selectedRecord.name = data.name;
    this.selectedRecord.text = data.text;

  }

  public onRecordRestore(recordId): void {
    this.managerDataHandlerService.getById(this.tab, recordId)
      .subscribe((data) => {
        const record = this.recordCollection.find((item) => item.id === recordId);
        const index = this.recordCollection.indexOf(record);
        this.recordCollection.splice(index, 1, data);
      }, error => console.log(error));
  }

  public showSavedToaster(isItOn: boolean): void {
    if (isItOn) {
      this.isSavedToasterOn = true;
      setTimeout(() => {
        this.isSavedToasterOn = false;
      }, 4000);
    }
  }
}
