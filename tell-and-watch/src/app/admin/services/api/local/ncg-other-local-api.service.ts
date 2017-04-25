// angular
import { Injectable } from '@angular/core';

// models
import * as InterfaceProvider from './../models/interface-providers';

// services
import { BaseApiLocal } from './../../../common/services/api/BaseApiLocal';
import { LocalQueryHelper } from './../../../common/services/api/LocalQueryHelper';

'use strict';

@Injectable()
export class NcgOtherApiLocal extends BaseApiLocal<InterfaceProvider.NcgOther> {
  public list: InterfaceProvider.NcgOther[];
  public keyName: string = 'id';
  public resourceName: string = 'ncgOther';

  constructor(_LocalQueryHelper: LocalQueryHelper) {
    super(_LocalQueryHelper);

    this.setListData();
  }

  convertTo(list: any): InterfaceProvider.NcgOther[] {
    let listToReturn: InterfaceProvider.NcgOther[] = [];

    list.forEach(
      (item) => {
        listToReturn.push(item);
      });
    return listToReturn;
  }

  protected setListData() {
    let ncgOtherSampleData = require('./NcgOther.json');

    this.list = this.convertTo(ncgOtherSampleData.value);
  }
}
