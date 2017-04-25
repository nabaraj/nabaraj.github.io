
import { Routes } from '@angular/router';
import {DevInfoComponent} from "./components/dev-info.component";
import {SplashComponent} from "./components/splash.component";
import {VideoComponent} from "./components/video.component";

export const AppRoutes: Routes = [
  {path: '',component: SplashComponent},
  {path: 'devinfo',component: DevInfoComponent},
  {path: 'videos',component: VideoComponent}
];
