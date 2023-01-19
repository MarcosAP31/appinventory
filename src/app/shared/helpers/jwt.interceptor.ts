import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreService } from 'src/app/service/store.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private storeService:StoreService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request=request.clone({
      setHeaders:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    return next.handle(request);
  }
}
