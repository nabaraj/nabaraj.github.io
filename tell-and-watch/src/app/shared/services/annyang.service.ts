import {Injectable} from '@angular/core'
declare let annyang:any;

@Injectable()
export class AnnyangService {
  start() {
    annyang.addCommands(this.commands);
    annyang.debug(true);
    annyang.start({continuous: false });
  }

  commands = {};
}
