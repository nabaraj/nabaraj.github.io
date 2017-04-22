// angular
import { Injectable } from '@angular/core';

// models
import * as InterfaceProvider from './../models/interface-providers';

// services
import { BaseApiLocal } from './../../../common/services/api/BaseApiLocal';
import { LocalQueryHelper } from './../../../common/services/api/LocalQueryHelper';

'use strict';

@Injectable()
export class NcgValidationApiLocal extends BaseApiLocal<InterfaceProvider.NcgValidation> {
  public list: InterfaceProvider.NcgValidation[];
  public keyName: string = 'id';
  public resourceName: string = 'ncgValidation';

  constructor(_LocalQueryHelper: LocalQueryHelper) {
    super(_LocalQueryHelper);

    this.setListData();
  }

  convertTo(list: any): InterfaceProvider.NcgValidation[] {
    let listToReturn: InterfaceProvider.NcgValidation[] = [];

    list.forEach(
      (item) => {
        listToReturn.push(item);
      });
    return listToReturn;
  }

  protected setListData() {
    let ncgValidationSampleData = require('./NcgValidation.json');

    this.list = this.convertTo(ncgValidationSampleData.value);
  }
}
