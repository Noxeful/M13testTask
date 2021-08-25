import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {EventsService} from "../../services/events.service";
import {ManagerDataHandlerService} from "../../services/manager-data-handler.service";
import {ManagerDataObject} from "../../entities/managerDataObject";

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css'],

})
export class ManagerComponent implements OnInit {

  public tab: string = 'queries';
  public dataCollection: ManagerDataObject[] = [];
  public recordHasBeenChanged: boolean = false;
  public selectedRecord: ManagerDataObject;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private eventsService: EventsService, private managerDataHandlerService: ManagerDataHandlerService,
              private router: Router) { }

  ngOnInit(): void {
    this.eventsService.recordSaved
      .subscribe((data: ManagerDataObject) => {
          this.dataCollection?.push(data);
      },
        error => console.log(error)
      );

    this.eventsService.recordDeleted
      .subscribe((data) => {
          const record = this.dataCollection?.find((item) => item.id === data);
          if (record) {
            const recordIndex = this.dataCollection?.indexOf(record);
            this.dataCollection.splice(recordIndex, 1);
          }
      },
        error => console.log(error)
      );

    this.eventsService.tempRecordSaved
      .subscribe((data) => {
        const record = this.dataCollection.find((item) => item.id === data);
        if (record) {
          const recordtIndex = this.dataCollection.indexOf(record);
          this.dataCollection.splice(recordtIndex, 1);
        }

      }, error => console.log(error));

    this.eventsService.recordUpdated
      .subscribe((data) => {
        const record = this.dataCollection.find((item) => item.id === data.id);
        if (record) {
          const recordtIndex = this.dataCollection.indexOf(record);
          this.dataCollection.splice(recordtIndex, 1, data);
        }
      }, error => console.log(error));

    this.eventsService.recordChanged
      .subscribe((data) => {
        let record = this.dataCollection.find((item) => item.id === data);
        if (record) {
          const recordIndex = this.dataCollection.indexOf(record);
          record.status = 'Изменен';
          this.dataCollection.splice(recordIndex, 1, record);
        }
      }, error => console.log(error));

    this.activatedRoute.paramMap
      .subscribe( (params: ParamMap) => {
        let param = params.get('tab');
        if (param) {
          let data: string = param.replace(':','');
          this.tab = data;
        }
        this.getAllEntities();
      });

  }

  public getAllEntities(): void {
    this.managerDataHandlerService.getAllEntities(this.tab)
      .subscribe((data) => {
        this.dataCollection = data;
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

  public onRecordSelect(data: ManagerDataObject): void {
    this.selectedRecord = data;
  }

  public onRecordChanged(data: boolean): void {
    if (this.selectedRecord.status !== 'Новый') {
      this.selectedRecord.status = 'Изменен';
    } else {

    }
  }

}
