// angular
import { Injectable } from '@angular/core';

// models
import * as InterfaceProvider from './../models/interface-providers';

// services
import { BaseApiLocal } from './../../../common/services/api/BaseApiLocal';
import { LocalQueryHelper } from './../../../common/services/api/LocalQueryHelper';

'use strict';

@Injectable()
export class NcgTypeAndFormatApiLocal extends BaseApiLocal<InterfaceProvider.NcgTypeAndFormat> {
  public list: InterfaceProvider.NcgTypeAndFormat[];
  public keyName: string = 'id';
  public resourceName: string = 'ncgTypeAndFormat';

  constructor(_LocalQueryHelper: LocalQueryHelper) {
    super(_LocalQueryHelper);

    this.setListData();
  }

  convertTo(list: any): InterfaceProvider.NcgTypeAndFormat[] {
    let listToReturn: InterfaceProvider.NcgTypeAndFormat[] = [];

    list.forEach(
      (item) => {
        listToReturn.push(item);
      });
    return listToReturn;
  }

  protected setListData() {
    let ncgTypeAndFormatSampleData = require('./NcgTypeAndFormat.json');

    this.list = this.convertTo(ncgTypeAndFormatSampleData.value);
  }
}
