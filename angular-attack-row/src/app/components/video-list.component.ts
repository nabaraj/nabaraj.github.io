/**
 * Created by dhazra on 4/22/2017.
 */
import {Component, Input} from '@angular/core'
import {TellAndWatchComponent} from "../app.component";

@Component({
  selector:'video-list',
  templateUrl:`app/templates/video-list.component.html`
})
export class VideoListComponent {
  @Input() list
  constructor( private tawComponent: TellAndWatchComponent){

  }
  playThisVideo(id){
    this.tawComponent.playVideo(""+(id+1))
  }
}
