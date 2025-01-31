'use strict';

export interface IQuery {
  count: boolean,
  expand: string,
  filter: string,
  keywords: string,
  orderBy: string,
  select: string,
  skip: number,
  top: number,
}
