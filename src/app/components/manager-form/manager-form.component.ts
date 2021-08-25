import {Component, Input, OnInit} from '@angular/core';
import {ManagerDataObject} from "../../entities/managerDataObject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {ManagerDataHandlerService} from "../../services/manager-data-handler.service";
import {EventsService} from "../../services/events.service";
import {error} from "@angular/compiler/src/util";

@Component({
  selector: 'app-manager-form',
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.scss']
})
export class ManagerFormComponent implements OnInit {

  @Input() public tab: string = 'queries';

  public isFormDisabled: boolean = false;

  public name: string = '';
  public text: string = '';
  public tempRecordsArray: ManagerDataObject[] = [];
  public focusedRecordId: number = 0; //новая не сохранённая запись всегда имеет айди < 0, сохраненная > 0
  public focusedRecord: ManagerDataObject | undefined;

  public nameControl: FormControl = new FormControl(this.name, [Validators.required]);
  public textControl: FormControl = new FormControl(this.text, [Validators.required]);
  public recordForm: FormGroup = new FormGroup({
    name: this.nameControl,
    text: this.textControl,
  });

  constructor(private managerDataHandlerService: ManagerDataHandlerService, private eventsService: EventsService) { }

  ngOnInit(): void {
    this.buildRecordForm(true);

    this.eventsService.tempRecordCreated
      .subscribe((data) => {
        this.tempRecordsArray.push(data);
        this.focusedRecordId = data.id;
        this.recordForm.enable();
          console.log(data);
        },
        error => console.log(error)
      );

    this.eventsService.recordFocused
      .subscribe((data) => {
        console.log(data, 'asdadsads ');
        this.focusedRecord = data;
        this.focusedRecordId = data.id;
        this.name = data.name;
        this.text = data.text;
        this.recordForm.enable();
        this.buildRecordForm(false);
      }, error => console.log(error));

  }

  private buildRecordForm(disabled: boolean): void {
    this.nameControl = new FormControl({value: this.name, disabled: disabled}, [Validators.required]);
    this.textControl = new FormControl({value: this.text, disabled: disabled}, [Validators.required]);
    this.recordForm = new FormGroup({
      name: this.nameControl,
      text: this.textControl,
    });
    this.recordForm.valueChanges
      .pipe(
        debounceTime(30)
      )
      .subscribe((data) => {
        this.name = data.name;
        this.text = data.text;
      });
  }

  public createNewRecord(name: string, text: string): void {
    this.managerDataHandlerService.getAllEntities(this.tab)
      .subscribe((data) => {
        const arr = data;
        const num = Math.max.apply(Math, arr.map((item: ManagerDataObject) => item.id));
        let newRecord: ManagerDataObject = new ManagerDataObject(num, name, text, new Date(), 'Saved');
        if (newRecord.id < 1) {
          alert('Запись не создана');
        } else {
          this.managerDataHandlerService.createEntity(this.tab, newRecord)
            .subscribe((data) => {
                console.log(data, ' :createNewRecord Result');
                this.eventsService.recordSaved.emit(data);
                this.eventsService.tempRecordSaved.emit(this.focusedRecordId);
                this.removeSavedRecord(this.focusedRecordId);
                this.recordForm.reset();
                this.recordForm.disable();
              },
              error => console.log(error)
            );
        }
        },
        error => console.log(error)
      );
  }

  public onOkButton(name: string, text: string) {
    if (this.focusedRecordId < 0) {
      this.createNewRecord(name, text);
    } else if (this.focusedRecordId > 0) {

    }
  }

  public removeSavedRecord(id: number): void {
    const record = this.tempRecordsArray.find((item) => item.id === id);
    if (record) {
      const recordtIndex = this.tempRecordsArray.indexOf(record);
      this.tempRecordsArray.splice(recordtIndex, 1);
    }
  }

}
