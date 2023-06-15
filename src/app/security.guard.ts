import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SecurityGuard implements CanActivate {
  constructor(private cookieService:CookieService,private router:Router){

  }
  
  redirect(flag:boolean):any{
    if(!flag){
      this.router.navigate(['/pages','login'])
    }
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const cookie=this.cookieService.check('token_access');
      this.redirect(cookie)
    return cookie;
    
  }
  
}
