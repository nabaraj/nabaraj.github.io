/**
 * Created by dhazra on 4/22/2017.
 */
import {Injectable} from '@angular/core'
import {Http} from "@angular/http";

@Injectable()

export class YouTubeService {
  constructor(private http: Http) {
  }

  getYouTubeVideos(searchText) {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?q=' + searchText + '&type=video&safeSearch=strict&part=snippet&key=AIzaSyAJk1xUI72YYfBMgEc84gjHUX-k2AN6-B0')
      .map(
        res => res.json().items)
  }
}
