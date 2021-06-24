import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AppHttpHelper } from './app-http-helper';
import { TokenService } from './auth/token.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) { }

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {

    // console.log('Request on its way');
    // console.log(req.url);

    // For preparing actual request headers
    let reqHeaders = req.headers;

    // Unauthorized handling check
    let unauthorizedHandling = true;
    if (reqHeaders.get(AppHttpHelper.SKIP_UNAUTHORIZED_HANDLING) != null) {
      unauthorizedHandling = false;
      reqHeaders = reqHeaders.delete(AppHttpHelper.SKIP_UNAUTHORIZED_HANDLING);
    }

    // Adding token in request
    const token = sessionStorage.getItem(environment.tokenStorageKey);

    reqHeaders = reqHeaders.set('Authorization', `Bearer ${token}`);

    // Making request copy as we may need original later
    const reqCopy = req.clone({ headers: reqHeaders });

    // Handle request & get observable
    let httpEvent$ = handler.handle(reqCopy);

    // Returning the final observable for request
    return httpEvent$;
  }

  async fetchToken(): Promise<string> {
    let token = '';
    this.tokenService.iframeTokenEmitter$.subscribe(accessToken => {
      token = accessToken;
    });
    return token;
  }

}
