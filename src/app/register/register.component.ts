import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  accountService = inject(AccountService);
  auth = inject(Auth);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['', Validators.required]
  });

  errMessage: string | null = null;

  onSubmit(): void {
    const rawForm = this.registerForm.getRawValue();
    const email = rawForm.email ?? '';
    const password = rawForm.password ?? '';
    const role = rawForm.role ?? '';

    this.accountService.register(email, password, role).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errMessage = err.code;
      }
    });
  }
}
