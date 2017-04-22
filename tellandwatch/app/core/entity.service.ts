import { Injectable } from '@angular/core';

@Injectable()
export class EntityService {
  clone<T>(source: T): T {
    return Object.assign({}, source);
  }

  merge = (target: any, ...sources: any[]) => Object.assign(target, ...sources);

  propertiesDiffer = (entityA: {}, entityB: {}) => Object.keys(entityA).find(key => entityA[key] !== entityB[key]);
}


/*
Copyright 2016 JohnPapa.net, LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://bit.ly/l1cense
*/