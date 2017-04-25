import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface ToastMessage {
  message:string
}

@Injectable()
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();

  toastState = this.toastSubject.asObservable();

  constructor(@Optional() @SkipSelf() prior: ToastService) {
    if (prior) {
      console.log('toast service already exists');
      return prior;
    } else {
      console.log('created toast service')
    }
  }

  activate(message?: string) {
    this.toastSubject.next(<ToastMessage>{ message: message });
  }
}


/*
Copyright 2016 JohnPapa.net, LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://bit.ly/l1cense
*/