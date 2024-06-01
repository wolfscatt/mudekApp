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

  onSubmit(): void {
    const rawForm = this.loginForm.getRawValue();
    const email = rawForm.email ?? '';
    const password = rawForm.password ?? '';
    const role = rawForm.role ?? '';

    this.accountService.login(email, password).subscribe({
      next: () => {
        const currentUser = this.auth.currentUser;
        if(currentUser){
          this.accountService.getUserRole(currentUser.uid).then(role => {
            if(role === 'supervisor'){
              this.router.navigate(['/supervisor']);
            } else if(role === 'associate'){
              this.router.navigate(['/associate']);
            } else if(role === 'headOfDepartment') {
              this.router.navigate(['/headOfDepartment']);
            } 
        })};
      },
      error: (err) => {
        this.errMessage = err.code;
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}

