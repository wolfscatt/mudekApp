import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, user, UserProfile, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore'; // Firestore doğru şekilde import edildi
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);
  user$ = user(this.firebaseAuth);
  currentUserSignal = signal<UserProfile | null | undefined>(undefined);


  register(email: string, password: string, role: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password)
      .then(response => {
        return updateProfile(response.user, { displayName: role }).then(() => {
          const userRef = doc(this.firestore, `users/${response.user.uid}`);
          return setDoc(userRef, { email, role });
        });
      });

    return from(promise);

  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => { });
    return from(promise);
  }
  
  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      this.currentUserSignal.set(null);
    });
    return from(promise);
  }

  // Kullanıcının rolünü almak için yardımcı fonksiyon
  getUserRole(uid: string): Observable<string | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userRef)).pipe(
      map(docSnap => docSnap.exists() ? (docSnap.data()['role'] as string) : null),
      catchError(() => of(null)) // Hata durumunda null döner
    );
  }

  // Giriş yapan kullanıcıyı takip etmek için observable
  trackCurrentUser(): Observable<UserProfile | null> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) {
          this.currentUserSignal.set({email: user.email!, displayName: user.displayName!});
          return this.getUserRole(user.uid).pipe(
            map(role => ({ ...user, role } as UserProfile)),
            catchError(() => of(null)) // Hata durumunda null döner
          );
        } else {
          this.currentUserSignal.set(null);
          return of(null);
        }
      })
    );
  }
}
