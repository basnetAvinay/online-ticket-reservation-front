import { Component, OnInit } from '@angular/core';
import { TokenService } from './auth/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  isInitialTokenValid = false;

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    // this.tokenService.setTokenForDevelopmentEnvironment();
    this.tokenService.initialTokenCheck().subscribe(validity => this.isInitialTokenValid = validity);
    this.tokenService.requestToken();
  }

}
