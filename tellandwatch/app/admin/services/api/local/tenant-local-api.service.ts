// angular
import { Injectable } from '@angular/core';

// models
import * as InterfaceProvider from './../models/interface-providers';

// services
import { BaseApiLocal } from './../../../common/services/api/BaseApiLocal';
import { LocalQueryHelper } from './../../../common/services/api/LocalQueryHelper';

'use strict';

@Injectable()
export class TenantApiLocal extends BaseApiLocal<InterfaceProvider.Tenant> {
  public list: InterfaceProvider.Tenant[];
  public keyName: string = 'id';
  public resourceName: string = 'tenant';

  constructor(_LocalQueryHelper: LocalQueryHelper) {
    super(_LocalQueryHelper);

    this.setListData();
  }

  convertTo(list: any): InterfaceProvider.Tenant[] {
    let listToReturn: InterfaceProvider.Tenant[] = [];

    list.forEach(
      (item) => {
        listToReturn.push(item);
      });
    return listToReturn;
  }

  protected setListData() {
    let tenantSampleData = require('./Tenant.json');

    this.list = this.convertTo(tenantSampleData.value);
  }
}
