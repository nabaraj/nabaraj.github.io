// angular
import { Injectable } from '@angular/core';

// models
import * as InterfaceProvider from './../models/interface-providers';

// services
import { BaseApiLocal } from './../../../common/services/api/BaseApiLocal';
import { LocalQueryHelper } from './../../../common/services/api/LocalQueryHelper';

'use strict';

@Injectable()
export class SomeItemApiLocal extends BaseApiLocal<InterfaceProvider.SomeItem> {
  public list: InterfaceProvider.SomeItem[];
  public keyName: string = 'id';
  public resourceName: string = 'someItem';

  constructor(_LocalQueryHelper: LocalQueryHelper) {
    super(_LocalQueryHelper);

    this.setListData();
  }

  convertTo(list: any): InterfaceProvider.SomeItem[] {
    let listToReturn: InterfaceProvider.SomeItem[] = [];

    list.forEach(
      (item) => {
        listToReturn.push(item);
      });
    return listToReturn;
  }

  protected setListData() {
    let someItemSampleData = require('./SomeItem.json');

    this.list = this.convertTo(someItemSampleData.value);
  }
}
