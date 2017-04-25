import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'displayDataTransform', pure: true })
export class DisplayDataTransformPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    let dataList = args.shift();

    if (dataList && typeof (dataList) === 'object' && dataList.length > 0) {
      let filterProp = args[0], // this prop used for compare with value to filter item in the list
        displayProp = args[1]; // this prop used for getting data to display.

      let filterList = dataList.filter(item => {
        return item[filterProp].toString() === value.toString();
      });

      if (filterList.length > 0) {
        return filterList[0][displayProp];
      } else {
        return value;
      }

    } else {
      return value;
    }
  }
}
