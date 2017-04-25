/**
 * Created by dhazra on 4/23/2017.
 */

import {Component, OnInit} from '@angular/core'
import {TAWHttpRequestService} from "../shared/services/taw-http-request.service"
import {Observable} from "rxjs";

@Component({
  selector:'dev-info',
  templateUrl:`app/templates/dev-info.component.html`
})
export class DevInfoComponent implements OnInit{
  devInfos: Observable<any>
  constructor(private tAWHttpRequestService: TAWHttpRequestService){

  }
  ngOnInit(){
    this.tAWHttpRequestService.getDevInfo().subscribe(data=> {
      this.devInfos = data
    })
  }
}
