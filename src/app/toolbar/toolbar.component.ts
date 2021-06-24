import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenService } from '../auth/token.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  isAuthenticated = false;
  isAuthenticatedSub: Subscription;

  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    this.isAuthenticatedSub = this.tokenService.isAuthenticated$.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  logout() {
    this.tokenService.logout();
  }

}
