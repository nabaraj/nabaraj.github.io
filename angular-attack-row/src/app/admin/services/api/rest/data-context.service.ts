// angular
import { Component, Injectable } from '@angular/core';

// services
import * as ApiProviders from './api-providers';

@Injectable()
export class DataContext {
  
  public DefaultTypeAndFormatApi: any;
  public DefaultValidationApi: any;
  public NcgOtherApi: any;
  public NcgTypeAndFormatApi: any;
  public NcgValidationApi: any;
  public SomeItemApi: any;
  public TenantApi: any;
  public TypeOfTypeApi: any;
  public UserApi: any;
  public ValidationApi: any;

  constructor(
    defaultTypeAndFormatApi: ApiProviders.DefaultTypeAndFormatApi,
    defaultValidationApi: ApiProviders.DefaultValidationApi,
    ncgOtherApi: ApiProviders.NcgOtherApi,
    ncgTypeAndFormatApi: ApiProviders.NcgTypeAndFormatApi,
    ncgValidationApi: ApiProviders.NcgValidationApi,
    someItemApi: ApiProviders.SomeItemApi,
    tenantApi: ApiProviders.TenantApi,
    typeOfTypeApi: ApiProviders.TypeOfTypeApi,
    userApi: ApiProviders.UserApi,
    validationApi: ApiProviders.ValidationApi
    
  ) {
    this.DefaultTypeAndFormatApi = defaultTypeAndFormatApi;
    this.DefaultValidationApi = defaultValidationApi;
    this.NcgOtherApi = ncgOtherApi;
    this.NcgTypeAndFormatApi = ncgTypeAndFormatApi;
    this.NcgValidationApi = ncgValidationApi;
    this.SomeItemApi = someItemApi;
    this.TenantApi = tenantApi;
    this.TypeOfTypeApi = typeOfTypeApi;
    this.UserApi = userApi;
    this.ValidationApi = validationApi;
    // this.defineLazyLoadedRepos();
  }

  
}
