/**
 * Created by dhazra on 4/23/2017.
 */
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TellAndWatchComponent} from "../app.component";

@Component({
  selector: 'video-component',
  templateUrl: `app/templates/video.component.html`
})


export class VideoComponent implements OnInit{
  videoData: any
  constructor(private tawComponent: TellAndWatchComponent){

  }
  ngOnInit () {
    this.videoData = this.tawComponent.videoComponentData
  }
}
