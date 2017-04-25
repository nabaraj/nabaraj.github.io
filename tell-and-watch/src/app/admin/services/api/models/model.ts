// angular
import { Injectable } from '@angular/core';

// services
import * as ApiProviders from '../rest/api-providers';
import * as ApiProvidersLocal from '../local/api-providers-local';

@Injectable()
export class EntityModel {
  entityNames() {
    return {
      DefaultTypeAndFormat: 'DefaultTypeAndFormat',
      DefaultValidation: 'DefaultValidation',
      NcgOther: 'NcgOther',
      NcgTypeAndFormat: 'NcgTypeAndFormat',
      NcgValidation: 'NcgValidation',
      SomeItem: 'SomeItem',
      Tenant: 'Tenant',
      TypeOfType: 'TypeOfType',
      User: 'User',
      Validation: 'Validation'
    };
  }

  repoNames() {
    return [
      'DefaultTypeAndFormat',
      'DefaultValidation',
      'NcgOther',
      'NcgTypeAndFormat',
      'NcgValidation',
      'SomeItem',
      'Tenant',
      'TypeOfType',
      'User',
      'Validation'
    ];
  }

  repoApiLocal() {
    return {
      'DefaultTypeAndFormat': ApiProvidersLocal.DefaultTypeAndFormatApiLocal,
      'DefaultValidation': ApiProvidersLocal.DefaultValidationApiLocal,
      'NcgOther': ApiProvidersLocal.NcgOtherApiLocal,
      'NcgTypeAndFormat': ApiProvidersLocal.NcgTypeAndFormatApiLocal,
      'NcgValidation': ApiProvidersLocal.NcgValidationApiLocal,
      'SomeItem': ApiProvidersLocal.SomeItemApiLocal,
      'Tenant': ApiProvidersLocal.TenantApiLocal,
      'TypeOfType': ApiProvidersLocal.TypeOfTypeApiLocal,
      'User': ApiProvidersLocal.UserApiLocal,
      'Validation': ApiProvidersLocal.ValidationApiLocal
    };
  }

  repoApi() {
    return {
      'DefaultTypeAndFormat': ApiProviders.DefaultTypeAndFormatApi,
      'DefaultValidation': ApiProviders.DefaultValidationApi,
      'NcgOther': ApiProviders.NcgOtherApi,
      'NcgTypeAndFormat': ApiProviders.NcgTypeAndFormatApi,
      'NcgValidation': ApiProviders.NcgValidationApi,
      'SomeItem': ApiProviders.SomeItemApi,
      'Tenant': ApiProviders.TenantApi,
      'TypeOfType': ApiProviders.TypeOfTypeApi,
      'User': ApiProviders.UserApi,
      'Validation': ApiProviders.ValidationApi
    };
  }
}
