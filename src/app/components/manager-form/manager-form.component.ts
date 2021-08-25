/* tslint:disable */
/* eslint-disable */
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ManagerDataObject} from "../../entities/managerDataObject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, take} from "rxjs/operators";
import {ManagerDataHandlerService} from "../../services/manager-data-handler.service";
import {EventsService} from "../../services/events.service";

@Component({
  selector: 'app-manager-form',
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.scss']
})
export class ManagerFormComponent implements OnInit, OnChanges {

  @Input() public tab: string = 'queries';
  // @ts-ignore
  @Input() public focusedRecord: ManagerDataObject;
  @Output() public recordHasBeenChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isFormDisabled: boolean = true;

  public tempRecordsArray: ManagerDataObject[] = [];
// @ts-ignore
//   public focusedRecord: ManagerDataObject;
// @ts-ignore
  public nameControl: FormControl;
  // @ts-ignore
  public textControl: FormControl;
  // @ts-ignore
  public recordForm: FormGroup;

  constructor(private managerDataHandlerService: ManagerDataHandlerService, private eventsService: EventsService) {
    this.buildRecordForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.focusedRecord) {
      this.resetForm();
      this.fillForm(this.focusedRecord);
    }
  }

  ngOnInit(): void {

    this.eventsService.tempRecordCreated
      .subscribe((data) => {
        this.tempRecordsArray.push(data);
        this.isFormDisabled = false;
          console.log(data);
        },
        error => console.log(error)
      );

    // this.eventsService.recordFocused
    //   .subscribe((data) => {
    //     this.focusedRecord = data;
    //     this.isFormDisabled = false;
    //     this.fillForm(data);
    //
    //   }, error => console.log(error));

    this.eventsService.recordDeleted
      .subscribe((data) => {
        this.resetForm();
      }, error => console.log(error));



  }

  public fillForm(data: ManagerDataObject): void {
    this.nameControl.setValue(data.name, {onlySelf: false, emitEvent: false});
    this.textControl.setValue(data.text, {onlySelf: false, emitEvent: false});
    this.recordForm.enable();
  }


  private buildRecordForm(): void {
    this.nameControl = new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern('[-_a-zA-Zа-яА-Я0-9]*')
    ]);
    this.textControl = new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10000)
    ]);
    this.recordForm = new FormGroup({
      name: this.nameControl,
      text: this.textControl,
    });
    this.recordForm.disable();

    this.recordForm.valueChanges
      .pipe(
        debounceTime(30)
      )
      .subscribe((data) => {
        console.log('from form: ', data);
        if (data && !this.recordForm.pristine) {
          this.recordHasBeenChanged.emit(true);
        }
      }, error => console.log(error));
  }

  public createNewRecord(): void {
    this.managerDataHandlerService.getAllEntities(this.tab)
      .subscribe((data) => {
        const arr = data;
        const num = Math.max.apply(Math, arr.map((item: ManagerDataObject) => item.id));
        let newRecord: ManagerDataObject = new ManagerDataObject(num, this.focusedRecord.name, this.focusedRecord.text, new Date(), 'Saved');
        if (newRecord.id < 1) {
          alert('Запись не создана');
        } else {
          this.managerDataHandlerService.createEntity(this.tab, newRecord)
            .subscribe((data) => {
                console.log(data, ' :createNewRecord Result');
                this.eventsService.recordSaved.emit(data);
                this.eventsService.tempRecordSaved.emit(this.focusedRecord.id);
                this.removeSavedRecord(this.focusedRecord.id);
                this.resetForm();
              },
              error => console.log(error)
            );
        }
        },
        error => console.log(error)
      );
  }

  public updateRecord(): void {
    if (this.focusedRecord) {
      const updatedRecord = new ManagerDataObject(this.focusedRecord.id, this.focusedRecord.name, this.focusedRecord.text, new Date(), 'Saved');
      this.managerDataHandlerService.updateById(this.tab, updatedRecord.id, updatedRecord)
        .subscribe((data) => {
          console.log(data, ' :updateRecord Result');
          this.eventsService.recordUpdated.emit(updatedRecord);
          this.resetForm();

        }, error => console.log(error));
    }

  }

  public onOkButton(): void {
    let a = this.recordForm.valid;
    console.log(a);
    if (this.focusedRecord.id < 0) {
      this.createNewRecord();
    } else if (this.focusedRecord.id > 0) {
      this.updateRecord();
    }
  }

  public removeSavedRecord(id: number): void {
    const record = this.tempRecordsArray.find((item) => item.id === id);
    if (record) {
      const recordIndex = this.tempRecordsArray.indexOf(record);
      this.tempRecordsArray.splice(recordIndex, 1);
    }
  }

  public resetForm(): void {
    this.recordForm.reset();
    this.recordForm.disable();
    this.recordForm.markAsPristine();
    this.isFormDisabled = true;
  }

}
/* tslint:enable */
/* eslint-enable */
