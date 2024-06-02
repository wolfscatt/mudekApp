import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, user, UserProfile, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore'; // Firestore doğru şekilde import edildi
import { Observable, from } from 'rxjs';

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
          return setDoc(userRef, {email, role });
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
  getUserRole(uid: string): Promise<string | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef).then(docSnap => {
      if (docSnap.exists()) {
        return docSnap.data()['role'];
      } else {
        return null;
      }
    });
  }
}
