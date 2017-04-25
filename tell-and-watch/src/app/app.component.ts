import { MaterialModule} from '@angular/material';
import {Component, NgZone, OnInit} from '@angular/core'
import {DomSanitizer} from "@angular/platform-browser";
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
import {AnnyangService} from './shared/services/annyang.service'
import {ToastrService} from './shared/services/toastr.service'
import {YouTubeService} from "./shared/services/youtube.service";

import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: `app/templates/home.component.html`,
})
export class TellAndWatchComponent implements OnInit {
  videoComponentData: any = {}
  results: Observable<any>;
  searchData:any = {}
  videoUrl: any;
  dangerousVideoUrl: string
  gridClass: string = "s12"
  val: string
  videoSearched: string

  instruction: any = `<h5>Help Text</h5>
  <p>Say "Search 'keyword' " to search videos</p>
  <p>Say "Play First/one" to play videos</p>
  <p>Say "Dev" to go devpage</p>
  <p>Say "Back" to go back to home page</p>
  <p>Say "Close Help" to close help popup</p>      
`

  constructor(private annyang: AnnyangService,
              private _ngZone: NgZone,
              private toastr: ToastrService,
              private youtubeService: YouTubeService,
              private route: ActivatedRoute,
              private router: Router,
              private materialize: MaterialModule,
              private domSanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.searchData.searchText = "Tell Something..."
    this.toastr.success(this.instruction);
    this.annyang.commands = {
      'search *val': (val)=> {
        this.captureVoiceAndSearchVideos(val);
      },
      'play *val': (val)=> {
        this.playVideo(val);
      },
      'deb*val': (val)=> {
        this.goToDevInfo();
      },
      'dev*val': (val)=> {
        this.goToDevInfo();
      },
      '*val info': (val)=> {
        this.goToDevInfo();
      },
      'video': (val)=> {
        this.goToVideos();
      },
      'videos': (val)=> {
        this.goToVideos();
      },
      'come *val': (val)=> {
        this.goBack()
      },
      'go back': (val)=> {
        this.goBack()
      },
      'go ba': (val)=> {
        this.goBack()
      },
      'back': (val)=> {
        this.goBack()
      },
      'sho help': ()=> {
        this.openHelp()
      },
      'sho hel': ()=> {
        this.openHelp()
      },
      'so help': ()=> {
        this.openHelp()
      },
      'Sohail': ()=> {
        this.openHelp()
      },
      'show help': ()=> {
        this.openHelp()
      },
      'show hel': ()=> {
        this.openHelp()
      },
      'close help': ()=> {
        this.closeHelp()
      }
    };
    this.annyang.start();
  }

  goToDevInfo() {
    this.searchData.searchText = 'DevInfo'
    this.router.navigate(['/devinfo']);
    window.location.reload();
  }

  goToVideos() {
    this.router.navigate(['/videos']);
  }
  openHelp=function(){
    this.toastr.success(this.instruction);
  };
  closeHelp=function(){
    this.toastr.clear();
  };

  goBack() {
    this.searchData.searchText = 'back'
    if (window.location.pathname != "/") {
      window.history.back();
    }
  }

  captureVoiceAndSearchVideos = function (val) {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.run(() => {
        this.searchData.searchText = val;
        this.youtubeService.getYouTubeVideos(val)
          .subscribe(data=> {
            this.videoComponentData.results = data;
            this.videoSearched="video-list-open"
            this.goToVideos()
          })
      });
    });
  };
  playVideo = function (val) {
    this.searchData.instruction = val
    val = val.toLowerCase();
    let numericArray1 = {
      "first": 0,
      "1": 0,
      "one": 0,
      "second": 1,
      "2": 1,
      "two": 1,
      "third": 2,
      "3": 2,
      "three": 2,
      "fourth": 3,
      "4": 3,
      "four": 3,
      "fifth": 4,
      "5": 4,
      "five": 4
    };
    let videoIndex = numericArray1[val]? numericArray1[val]: 0;

    this._ngZone.runOutsideAngular(() => {
      this._ngZone.run(() => {
        this.val = val
        for(var i=0; i<this.videoComponentData.results.length; i++){
          this.videoComponentData.results[i].className = ""
        }
        this.videoComponentData.results[videoIndex].className = "active"
        this.dangerousVideoUrl = 'https://www.youtube.com/embed/' + this.videoComponentData.results[videoIndex].id.videoId + '?rel=0&autoplay=1';
        this.videoComponentData.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl)
        this.videoComponentData.gridClass = "m3 list-view pull-m9"
      })
    })

  }
}
