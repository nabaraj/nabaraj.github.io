import {URLSearchParams} from '@angular/http';
import * as Rx from 'rxjs';
import {Injectable} from '@angular/core';
import {IApi} from './IApi';

import {LocalQueryHelper} from './LocalQueryHelper';

'use strict';

@Injectable()
export abstract class BaseApiLocal<T> implements IApi<T> {
  list: T[];
  keyName: string = 'addressId';

  constructor(public _LocalQueryHelper: LocalQueryHelper) {
    this.setListData();
  }

  // this is to convert from the JSON/OData
  abstract convertTo(list: any): T[];

  public get(expand?: string, filter?: string, select?: string, orderBy?: string, top?: number, skip?: number, count?: boolean,
    keywords?: string,
    extraHttpRequestParams?: any): Rx.Observable<{ count: number, list: T[] }> {
    console.log('orderBy: ' + orderBy);
    /* Using a disposable */
    let source = Rx.Observable.create(

      (observer) => {

        let timer = setTimeout(() => {
          try {
            let listWithCount = {
              count: this.list.length,
              list: this.list
            };

            this.changeDateStringToDateObject(listWithCount.list);

            // filter
            if (filter) {
              listWithCount.list = this._LocalQueryHelper.filter(listWithCount.list, filter);
              listWithCount.count = listWithCount.list.length;
            }

            if (keywords) {
              listWithCount.list = this._LocalQueryHelper.filterByKeywords(listWithCount.list, keywords);
              listWithCount.count = listWithCount.list.length;
            }

            // sort
            if (orderBy) {
              listWithCount.list = this._LocalQueryHelper.sort(listWithCount.list, orderBy);
            }

            // paging
            if (top || skip) {
              listWithCount.list = this._LocalQueryHelper.paging(listWithCount.list, top, skip);
            }

            // select
            if (select) {
              // UNDONE:
            }

            observer.next(listWithCount);
            observer.complete();
          } catch (error) {
            console.log(observer);

            observer.error(error);
          }
        }, 500);

        // console.log('started');

        return () => {
          // console.log('disposal called');
          clearTimeout(timer);
        };

      });

    return source;
  }

  public getById(id: number): Rx.Observable<T> {
    /* Using a disposable */
    let source = Rx.Observable.create(
      (observer) => {

        let timer = setTimeout(() => {
          try {
            let itemToReturn = this.list.filter((item) => {

              return item[this.keyName] === id;
            })[0];
            observer.next(itemToReturn);
            observer.complete();
          } catch (error) {
            console.log(observer);
            observer.error(error);
          }
        }, 500);
        return () => {
          // "disposal called""
          clearTimeout(timer);
        };

      });

    return source;
  }

  public getNewId() {
    return this.list.length + 1;
  }

  public post(item?: T, extraHttpRequestParams?: any): Rx.Observable<T> {
    console.log('BaseApiLocal post');
    let source = Rx.Observable.create(
      (observer) => {

        let timer = setTimeout(() => {
          try {
            this.list.push(item);

            observer.next(item);
            observer.complete();
          } catch (error) {
            console.log(observer);
            observer.error(error);
          }
        }, 500);
        return () => {
          // "disposal called""
          clearTimeout(timer);
        };

      });

    return source;
  }

  public delete(id: number, ifMatch?: string, extraHttpRequestParams?: any): Rx.Observable<{}> {
    console.log('BaseApiLocal delete');
    let source = Rx.Observable.create(
      (observer) => {

        let timer = setTimeout(() => {
          try {
            this.list = this.list.filter((item) => {

              return item[this.keyName] !== id;
            });

            observer.next(null);
            observer.complete();
          } catch (error) {
            console.log(observer);
            observer.error(error);
          }
        }, 500);
        return () => {
          // "disposal called""
          clearTimeout(timer);
        };

      });

    return source;
  }

  public patch(id: number, item?: T, extraHttpRequestParams?: any): Rx.Observable<T> {
    console.log('BaseApiLocal patch');
    let source = Rx.Observable.create(
      (observer) => {

        let timer = setTimeout(() => {
          try {
            let itemToPatch = this.list.filter((item) => {

              return item[this.keyName] === id;
            })[0];

            this.extend(item, itemToPatch);

            observer.next(itemToPatch);
            observer.complete();
          } catch (error) {
            console.log(observer);

            observer.error(error);
          }
        }, 500);
        return () => {
          // "disposal called""
          clearTimeout(timer);
        };

      });

    return source;
  }

  // http://stackoverflow.com/questions/33500924/copy-a-object-properties-to-another-in-typescript-cause-error-ts2339
  extend<T, U>(obj: T, extension: U) {
    Object.keys(obj).forEach((key) => {
      extension[key] = obj[key];
    });

    return extension as T & U;
  }

  public save(item?: T, isEdited: boolean = true, extraHttpRequestParams?: any): Rx.Observable<T> {
    // if is edit, else if new
    if (isEdited) {
      // TODO: update from cloned WIP
      return this.patch(item[this.keyName], item);
    } else {
      // add new
      return this.post(item);
    }
  }

  protected changeDateStringToDateObject(list) {
    list.forEach(address => {
      address.modifiedDate = new Date(address.modifiedDate);
    });
  }

  protected setListData() {
  };

}
