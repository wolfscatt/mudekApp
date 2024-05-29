import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore'; // Firestore doğru şekilde import edildi
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private afAuth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();

    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      } else {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }
    });
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  async login(email: string, password: string, role: string): Promise<any> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.afAuth, email, password);
      const user = userCredential.user;
      if (user) {
        // Store user in Firestore with role
        await this.updateUserData(user.uid, { role });
        localStorage.setItem('currentUser', JSON.stringify({ ...user, role }));
        this.currentUserSubject.next({ ...user, role });
        return user;
      }
      return null;  // User not found
    } catch (error) {
      console.error('Login error: ', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error: ', error);
      throw error;
    }
  }

  async register(email: string, password: string, role: string): Promise<any> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.afAuth, email, password);
      const user = userCredential.user;
      if (user) {
        // Store user in Firestore with role
        await this.updateUserData(user.uid, { role });
        localStorage.setItem('currentUser', JSON.stringify({ ...user, role }));
        this.currentUserSubject.next({ ...user, role });
        return user;
      } else {
        return null;  // User not created
      }
    } catch (error) {
      console.error('Registration error: ', error);
      throw error;
    }
  }

  async updateProfile(displayName: string, photoURL: string): Promise<any> {
    const user = this.afAuth.currentUser;
    if (user) {
      try {
        await updateProfile(user, { displayName, photoURL });
        // Update local storage
        const updatedUser = { ...user, displayName, photoURL };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        return updatedUser;
      } catch (error) {
        console.error('Update profile error: ', error);
        throw error;
      }
    } else {
      throw new Error('No user is currently logged in');
    }
  }

  private async updateUserData(uid: string, data: any): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    try {
      await setDoc(userRef, data, { merge: true });
    } catch (error) {
      console.error('Error updating user data: ', error);
      throw error;
    }
  }
}
