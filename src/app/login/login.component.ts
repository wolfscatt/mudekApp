import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AccountService]
})
export class LoginComponent {

  fb = inject(FormBuilder);
  router = inject(Router);
  accountService = inject(AccountService);
  auth = inject(Auth);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['', Validators.required]
  });

  errMessage: string | null = null;

  async onSubmit(): Promise<void> {
    const rawForm = this.loginForm.getRawValue();
    const email = rawForm.email ?? '';
    const password = rawForm.password ?? '';
    const role = rawForm.role ?? '';

    try {
      await this.accountService.login(email, password).toPromise();
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await this.accountService.getUserRole(currentUser.uid).subscribe((user) => {
          if (user === 'supervisor') {
            this.router.navigate(['/supervisor']);
          } else if (user === 'associate') {
            this.router.navigate(['/associate']);
          } else if (user === 'headOfDepartment') {
            this.router.navigate(['/headOfDepartment']);
          }
        });
      }
    } catch (err: any) {
      this.errMessage = err.message;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}

