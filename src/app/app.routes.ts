import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { AssociateComponent } from './associate/associate.component';
import { HeadOfDepartmentComponent } from './head-of-department/head-of-department.component';
import { AuthGuard } from './login/auth.guard';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: '', component: RegisterComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'supervisor', component: SupervisorComponent, canActivate: [AuthGuard]},
    { path: 'associate', component: AssociateComponent},
    { path: 'headOfDepartment', component: HeadOfDepartmentComponent},

];
