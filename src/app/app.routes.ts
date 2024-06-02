import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { AssociateComponent } from './associate/associate.component';
import { HeadOfDepartmentComponent } from './head-of-department/head-of-department.component';
import { AuthGuard } from './login/auth.guard';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CourseManagementComponent } from './associate/course-management/course-management.component';
import { CardDetailsComponent } from './associate/card-details/card-details.component';

export const routes: Routes = [
    { path: '', redirectTo : 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'supervisor', component: SupervisorComponent, canActivate: [AuthGuard]},
    { path: 'associate', component: AssociateComponent, canActivate: [AuthGuard]},
    { path: 'associate/courseManagement', component: CourseManagementComponent, canActivate: [AuthGuard]},
    { path: 'associate/cardDetails/:courseCode', component: CardDetailsComponent, canActivate: [AuthGuard]},
    { path: 'headOfDepartment', component: HeadOfDepartmentComponent, canActivate: [AuthGuard]},

];
