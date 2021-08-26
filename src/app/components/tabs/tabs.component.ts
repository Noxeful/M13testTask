import {Component, OnInit} from '@angular/core';
import {EventsService} from '../../services/events.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  public tab: string = 'queries';

  constructor(private eventsService: EventsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .subscribe( (params: ParamMap) => {
        const param = params.get('tab');
        if (param) {
          const data: string = param.replace(':','');
          this.tab = data;
        }
      }, error => console.log(error));
  }

  public navigatetToTab(tab: string): void  {
    this.router.navigate([`/manager/:${tab}/`]);
  }

}
