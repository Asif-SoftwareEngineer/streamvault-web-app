import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddVideoDetailsGuard  {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const queryParams = route.queryParams;

    let isNavigatingFromPreUploadVideoComponent: boolean = false;

    if (queryParams?.['from']) {
      isNavigatingFromPreUploadVideoComponent =
        queryParams?.['from'].includes('pre-upload-video');
    } else {
      isNavigatingFromPreUploadVideoComponent = false;
    }

    if (!isNavigatingFromPreUploadVideoComponent) {
      return this.router.parseUrl('user/user-home');
    }

    return true;
  }
}
