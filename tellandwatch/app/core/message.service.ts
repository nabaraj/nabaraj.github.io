import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import { CONFIG } from './config';
import { ToastService } from './toast/toast.service';

export interface ResetMessage {
  message: string;
}

@Injectable()
export class MessageService {
  private subject = new Subject<ResetMessage>();

  state = this.subject;

  constructor(private http: Http, private toastService: ToastService) { }

  resetDb() {
    let msg = 'Reset the Data Successfully';
    this.http.post(CONFIG.baseUrls.resetDb, null)
      .subscribe(() => {
        this.subject.next({ message: msg });
        this.toastService.activate(msg);
      });
  }
}


/*
Copyright 2016 JohnPapa.net, LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://bit.ly/l1cense
*/