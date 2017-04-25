// angular
import { Component, Injectable} from '@angular/core';

import * as ApiProvidersLocal from './api-providers-local';

@Component({
  // providers: [EntityModel]
})

@Injectable()
export class DataContextLocal {
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
    defaultTypeAndFormatApi: ApiProvidersLocal.DefaultTypeAndFormatApiLocal,
    defaultValidationApi: ApiProvidersLocal.DefaultValidationApiLocal,
    ncgOtherApi: ApiProvidersLocal.NcgOtherApiLocal,
    ncgTypeAndFormatApi: ApiProvidersLocal.NcgTypeAndFormatApiLocal,
    ncgValidationApi: ApiProvidersLocal.NcgValidationApiLocal,
    someItemApi: ApiProvidersLocal.SomeItemApiLocal,
    tenantApi: ApiProvidersLocal.TenantApiLocal,
    typeOfTypeApi: ApiProvidersLocal.TypeOfTypeApiLocal,
    userApi: ApiProvidersLocal.UserApiLocal,
    validationApi: ApiProvidersLocal.ValidationApiLocal
    
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

  /*private getServicesByRepoName(repoName) {
    return this._model.repoApiLocal()[repoName];
  }

  private defineLazyLoadedRepos() {
    this._model.repoNames().forEach((name) => {
      let service = this.getServicesByRepoName(name);

      Object.defineProperty(this, name, {
        configurable: true, // will redefine this property once
        get: () => {

          // The 1st time the repo is request via this property,
          // we ask the repositories for it (which will inject it).
          // var repo = repositories.getRepo(name);

          // Rewrite this property to always return this repo;
          // no longer redefinable
          Object.defineProperty(this, name, {
            value: service,
            configurable: false,
            enumerable: true
          });

          return service;
        }
      });
    });
  }*/
}
