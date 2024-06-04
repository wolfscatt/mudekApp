import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { AccountService } from './services/account.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  accountService = inject(AccountService);
  
  ngOnInit(): void {
    this.accountService.trackCurrentUser().pipe(
      catchError(err => {
        console.error('Error tracking current user:', err);
        return of(null); // Hata durumunda null döner
      })
    ).subscribe(user => {
      if (user) {
        this.accountService.currentUserSignal.set({
          email: user['email']!,
          displayName: user['displayName']!
        });
      } else {
        this.accountService.currentUserSignal.set(null);
      }
      console.log('User: ', this.accountService.currentUserSignal());
    });
  }
}
