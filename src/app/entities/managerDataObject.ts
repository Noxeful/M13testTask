export class ManagerDataObject {
  public id: number;
  public name: string;
  public text: string;
  public last_updated: Date;
  public status: string;

  constructor(id: number, name: string, text: string, lastUpdated: Date, status: string) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.last_updated = lastUpdated;
    this.status = this.checkStatus(status);
  }

  public checkStatus(status: string): string  {
  let result: string;
  switch (status) {
  case 'New':
    result = 'Новый';
    break;
  case 'Changed':
    result = 'Изменен';
    break;
  case 'Saved':
    result = 'Сохранен';
    break;
  default:
    result = 'Новый'
  }
  return result;
  }

}
