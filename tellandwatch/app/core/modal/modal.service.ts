import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
  activate: (message?: string, title?: string) => Promise<boolean>;
}


/*
Copyright 2016 JohnPapa.net, LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://bit.ly/l1cense
*/