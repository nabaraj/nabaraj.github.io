// angular
import { Injectable } from '@angular/core';

// models
import * as InterfaceProvider from './../models/interface-providers';

// services
import { BaseApiLocal } from './../../../common/services/api/BaseApiLocal';
import { LocalQueryHelper } from './../../../common/services/api/LocalQueryHelper';

'use strict';

@Injectable()
export class DefaultValidationApiLocal extends BaseApiLocal<InterfaceProvider.DefaultValidation> {
  public list: InterfaceProvider.DefaultValidation[];
  public keyName: string = 'id';
  public resourceName: string = 'defaultValidation';

  constructor(_LocalQueryHelper: LocalQueryHelper) {
    super(_LocalQueryHelper);

    this.setListData();
  }

  convertTo(list: any): InterfaceProvider.DefaultValidation[] {
    let listToReturn: InterfaceProvider.DefaultValidation[] = [];

    list.forEach(
      (item) => {
        listToReturn.push(item);
      });
    return listToReturn;
  }

  protected setListData() {
    let defaultValidationSampleData = require('./DefaultValidation.json');

    this.list = this.convertTo(defaultValidationSampleData.value);
  }
}
