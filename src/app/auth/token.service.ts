import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  readonly iframeTokenEmitter = new Subject<string>();
  readonly iframeTokenEmitter$ = this.iframeTokenEmitter.asObservable();
  readonly isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient, private router: Router){ }

  setTokenForDevelopmentEnvironment(): void {
    if (environment.production == false) {
      sessionStorage.setItem(environment.tokenStorageKey, environment.token);
    }
  }

  initialTokenCheck(): Observable<boolean> {
    console.log("Initial Token Check");
    const tokenValidityEmitter = new Subject<boolean>();
    tokenValidityEmitter.next(true)
    // this.httpClient.get(`${environment.apiBaseUrl}/test-token`).subscribe(() => tokenValidityEmitter.next(true));
    return tokenValidityEmitter.asObservable();
  }

  requestToken(): Observable<string> {
    this.fetchToken(environment.tokenRetry);
    return this.iframeTokenEmitter$;
  }

  private fetchToken(tokenRetry: number) {
    const tokenIframe = this.createTokenIframe();
    tokenIframe.onload = () => {
      const tokenHash = this.fetchHash(tokenIframe);
      document.body.removeChild(tokenIframe);
      if (tokenHash === '') {
        tokenRetry !== 1 ? this.fetchToken(tokenRetry - 1) : this.redirectToTokenLoginPage();
      } else {
        const accessToken = tokenHash.split('&')[0].replace('#access_token=', '');
        sessionStorage.setItem(environment.tokenStorageKey, accessToken);

        const parsedToken = JSON.parse(atob(accessToken.split('.')[1]));
        sessionStorage.setItem("authorities", parsedToken.authorities);
        sessionStorage.setItem("username", parsedToken.user_name);
        this.isAuthenticated$.next(true);
        
        this.iframeTokenEmitter.next(accessToken);
      }
    };
    document.body.appendChild(tokenIframe);
  }

  private createTokenIframe(): HTMLIFrameElement {
    const tokenIframe = document.createElement('iframe');
    tokenIframe.hidden = true;
    tokenIframe.src = `${environment.tokenUrl}&redirect_uri=${environment.tokenRedirectUrl}`;
    return tokenIframe;
  }

  private fetchHash(iframe: HTMLIFrameElement): string {
    try {
      return iframe.contentWindow.location.hash;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  logout() {
    this.isAuthenticated$.next(false);
    sessionStorage.removeItem("access-token");
    sessionStorage.removeItem("authorities");
    sessionStorage.removeItem("username");
    location.href = 'http://localhost:8080/logout';
  }

  private redirectToTokenLoginPage(): void {
    location.href = environment.tokenLoginUrl + `?target=${this.router.url}`;
  }
}