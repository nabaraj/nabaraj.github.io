// angular
import { Injectable } from '@angular/core';

// models
import * as InterfaceProvider from './../models/interface-providers';

// services
import { BaseApiLocal } from './../../../common/services/api/BaseApiLocal';
import { LocalQueryHelper } from './../../../common/services/api/LocalQueryHelper';

'use strict';

@Injectable()
export class TypeOfTypeApiLocal extends BaseApiLocal<InterfaceProvider.TypeOfType> {
  public list: InterfaceProvider.TypeOfType[];
  public keyName: string = 'id';
  public resourceName: string = 'typeOfType';

  constructor(_LocalQueryHelper: LocalQueryHelper) {
    super(_LocalQueryHelper);

    this.setListData();
  }

  convertTo(list: any): InterfaceProvider.TypeOfType[] {
    let listToReturn: InterfaceProvider.TypeOfType[] = [];

    list.forEach(
      (item) => {
        listToReturn.push(item);
      });
    return listToReturn;
  }

  protected setListData() {
    let typeOfTypeSampleData = require('./TypeOfType.json');

    this.list = this.convertTo(typeOfTypeSampleData.value);
  }
}
