/**
 * Created by dhazra on 4/22/2017.
 */
import { Component, Input} from '@angular/core'



@Component({
  selector:'video-player',
  templateUrl:`app/templates/video-player.component.html`
})
export class VideoPlayerComponent {
  @Input() video
  constructor(){

  }
}
