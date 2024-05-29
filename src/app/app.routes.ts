import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { AssociateComponent } from './associate/associate.component';
import { HeadOfDepartmentComponent } from './head-of-department/head-of-department.component';
import { AuthGuard } from './login/auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'supervisor', component: SupervisorComponent, canActivate: [AuthGuard]},
    { path: 'associate', component: AssociateComponent},
    { path: 'headOfDepartment', component: HeadOfDepartmentComponent},

];
