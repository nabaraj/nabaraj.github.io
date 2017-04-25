import { CanActivate } from '@angular/router';

export class AuthGuard implements CanActivate {

  canActivate() {
    // Imaginary method that is supposed to validate an auth token
    // and return a boolean
    // return tokenExistsAndNotExpired();
    return true;
  }

}
