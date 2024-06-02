import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{
  accountService = inject(AccountService);
  router = inject(Router);

  isLoggedIn = false;
  userRole: string | null = null;

  ngOnInit(): void {
    this.accountService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if(user){
        this.accountService.getUserRole(user.uid).then(role => {
          this.userRole = role;
        });
      }else{
        this.userRole = null;
      }
    });
  }

  logout(): void {
    this.accountService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
  login(): void {
    this.router.navigate(['/login']);
  }

}
