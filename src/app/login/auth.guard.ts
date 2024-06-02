import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth'; // Auth servisini import edin

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  auth = inject(Auth);
  router = inject(Router);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return authState(this.auth).pipe(
      take(1),
      map(user => !!user), // Kullanıcı varsa true, yoksa false döndürür
      tap(loggedIn => {
        if (!loggedIn ) {
          console.log('User not logged in, redirecting to login page...');
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
