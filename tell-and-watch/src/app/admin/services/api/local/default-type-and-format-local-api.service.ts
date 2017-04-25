// angular
import { Injectable } from '@angular/core';

// models
import * as InterfaceProvider from './../models/interface-providers';

// services
import { BaseApiLocal } from './../../../common/services/api/BaseApiLocal';
import { LocalQueryHelper } from './../../../common/services/api/LocalQueryHelper';

'use strict';

@Injectable()
export class DefaultTypeAndFormatApiLocal extends BaseApiLocal<InterfaceProvider.DefaultTypeAndFormat> {
  public list: InterfaceProvider.DefaultTypeAndFormat[];
  public keyName: string = 'id';
  public resourceName: string = 'defaultTypeAndFormat';

  constructor(_LocalQueryHelper: LocalQueryHelper) {
    super(_LocalQueryHelper);

    this.setListData();
  }

  convertTo(list: any): InterfaceProvider.DefaultTypeAndFormat[] {
    let listToReturn: InterfaceProvider.DefaultTypeAndFormat[] = [];

    list.forEach(
      (item) => {
        listToReturn.push(item);
      });
    return listToReturn;
  }

  protected setListData() {
    let defaultTypeAndFormatSampleData = require('./DefaultTypeAndFormat.json');

    this.list = this.convertTo(defaultTypeAndFormatSampleData.value);
  }
}
