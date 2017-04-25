import {Injectable} from '@angular/core';

@Injectable()
export class BusyIndicatorService {

  public start() {
    // UNDONE: we should remove jquery if just used for this.
    // let body = $('body'),
    //   busyIndicator = $('#busyIndicator');

    // if (busyIndicator['length'] === 0) {
    //   body['append'](`
    //   <div id="busyIndicator" style="position:fixed;left:0;top:0;bottom:0;right:0;opacity:0.3;z-index:100;background:#000;text-align:center;">
    //     <span style="position:absolute;top:50%;opacity:1; color: white; font-size: 20px; font-weight: bold">Loading ...</span>
    //   </div>`);
    // }
  }

  public stop() {
    // let busyIndicator = $('#busyIndicator');
    // if (busyIndicator['length'] !== 0) {
    //   busyIndicator['remove']();
    // }
  }
}
