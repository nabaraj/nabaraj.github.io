import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
  canDeactivate: () => any; // boolean|Promise<boolean>|Observable<boolean>;
}

export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | boolean {
    // run the function for canDeactivate and if its a promise or a boolean we handle it either way

    // return true;

    // if (component.canDeactivate) {
    //   let deactivate = component.canDeactivate();
    //   return this.toObservable(deactivate);
    // } else {
    //   return true;
    // }

    return component.canDeactivate ?
      this.toObservable(component.canDeactivate()) : true;
  }

  private toObservable(deactivate: Promise<boolean> | boolean ): Observable<boolean> | boolean {
    let p = Promise.resolve(deactivate);
    let o = Observable.fromPromise(p);
    return o;
  }
}


/*
Copyright 2016 JohnPapa.net, LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://bit.ly/l1cense
*/