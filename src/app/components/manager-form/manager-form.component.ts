import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ManagerDataObject} from '../../entities/managerDataObject';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {ManagerDataHandlerService} from '../../services/manager-data-handler.service';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-manager-form',
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.scss']
})
export class ManagerFormComponent implements OnInit, OnChanges {

  @Input() public tab: string = 'queries';
  @Input() public focusedRecord: ManagerDataObject;

  @Output() public recordHasBeenChanged: EventEmitter<ManagerDataObject> = new EventEmitter<ManagerDataObject>();
  @Output() public restoreRecord: EventEmitter<number> = new EventEmitter<number>();
  @Output() public recordSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isFormDisabled: boolean = true;

  public nameControl: FormControl;
  public textControl: FormControl;
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
        this.isFormDisabled = false;
        },
        error => console.log(error)
      );

    this.eventsService.recordDeleted
      .subscribe((data) => {
        this.resetForm();
      }, error => console.log(error));
  }

  public fillForm(data: ManagerDataObject): void {
    this.nameControl.setValue(data.name, {onlySelf: false, emitEvent: false});
    this.textControl.setValue(data.text, {onlySelf: false, emitEvent: false});
    this.isFormDisabled = false;
    this.recordForm.enable();
  }

  private buildRecordForm(): void {
    this.nameControl = new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern('[-_a-zA-Zа-яА-Я0-9 ]*')
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
        if (data && !this.recordForm.pristine) {
          this.recordHasBeenChanged.emit(data);
        }
      }, error => console.log(error));
  }

  public createNewRecord(): void {
    this.managerDataHandlerService.getAllEntities(this.tab)
      .subscribe((data) => {
        const arr = data;
        const num = Math.max.apply(Math, arr.map((item: ManagerDataObject) => item.id));
        const newRecord: ManagerDataObject = new ManagerDataObject(num, this.focusedRecord.name, this.focusedRecord.text, new Date(), 'Saved');
        if (newRecord.id < 1) {
          console.log('Запись не создана');
        } else {
          this.managerDataHandlerService.createEntity(this.tab, newRecord)
            .subscribe((data) => {
                console.log(data, ' :createNewRecord Result');
                this.eventsService.recordSaved.emit(data);
                this.eventsService.tempRecordSaved.emit(this.focusedRecord.id);
                this.recordSaved.emit(true);
                this.resetForm();
              }, error => console.log(error)
            );
        }
        }, error => console.log(error)
      );
  }

  public updateRecord(): void {
    if (this.focusedRecord) {
      const updatedRecord = new ManagerDataObject(this.focusedRecord.id, this.focusedRecord.name, this.focusedRecord.text, new Date(), 'Saved');
      this.managerDataHandlerService.updateById(this.tab, updatedRecord.id, updatedRecord)
        .subscribe((data) => {
          console.log(data, ' :updateRecord Result');
          this.eventsService.recordUpdated.emit(updatedRecord);
          this.recordSaved.emit(true);
          this.resetForm();
        }, error => console.log(error));
    }
  }

  public onOkButton(): void {
    if (this.focusedRecord.id < 0) {
      this.createNewRecord();
    } else if (this.focusedRecord.id > 0) {
      this.updateRecord();
    }
  }

  public resetForm(): void {
    this.recordForm.reset();
    this.recordForm.disable();
    this.recordForm.markAsPristine();
    this.isFormDisabled = true;
  }

  public cancelChanges(): void {
    if (this.focusedRecord.status === 'Изменен') {
      this.restoreRecord.emit(this.focusedRecord.id);
    }
    this.resetForm();
  }

}
