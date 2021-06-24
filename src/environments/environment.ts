// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  token: '',
  tokenUrl: 'http://localhost:8080/oauth/authorize?response_type=token&client_id=client',
  tokenRedirectUrl: 'http://localhost:4200/assets/token.html',
  tokenLoginUrl: 'http://localhost:8080/login',
  tokenRetry: 3,
  tokenRequestTimeout: 1000,
  tokenStorageKey: 'access-token'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
