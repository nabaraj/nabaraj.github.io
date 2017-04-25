/**
 * Created by dhazra on 4/23/2017.
 */
import {Injectable} from '@angular/core'
import {Http} from "@angular/http";

@Injectable()

export class TAWHttpRequestService {
  constructor(private http: Http) {
  }

  getDevInfo() {
    return this.http.get('./assets/local-data/dev-info.json')
      .map(
        res => res.json().developers)
  }
}
