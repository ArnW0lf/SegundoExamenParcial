import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { 
        path: 'students', 
        loadComponent: () => import('./students/student-list/student-list.component').then(m => m.StudentListComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      { 
        path: 'teachers', 
        loadComponent: () => import('./teachers/teacher-list/teacher-list.component').then(m => m.TeacherListComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      { 
        path: 'subjects', 
        loadComponent: () => import('./subjects/subject-list/subject-list.component').then(m => m.SubjectListComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      { 
        path: 'grades', 
        loadComponent: () => import('./grades/grade-list/grade-list.component').then(m => m.GradeListComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      // Rutas para profesores
      { 
        path: 'my-subjects', 
        loadComponent: () => import('./teachers/my-subjects/my-subjects.component').then(m => m.MySubjectsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['TEACHER'] }
      },
      { 
        path: 'my-students', 
        loadComponent: () => import('./teachers/my-students/my-students.component').then(m => m.MyStudentsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['TEACHER'] }
      },
      // Rutas para estudiantes
      { 
        path: 'my-courses', 
        loadComponent: () => import('./students/my-courses/my-courses.component').then(m => m.MyCoursesComponent),
        canActivate: [RoleGuard],
        data: { roles: ['STUDENT'] }
      },
      { 
        path: 'my-grades', 
        loadComponent: () => import('./students/my-grades/my-grades.component').then(m => m.MyGradesComponent),
        canActivate: [RoleGuard],
        data: { roles: ['STUDENT'] }
      },
      { 
        path: 'my-attendance', 
        loadComponent: () => import('./students/my-attendance/my-attendance.component').then(m => m.MyAttendanceComponent),
        canActivate: [RoleGuard],
        data: { roles: ['STUDENT'] }
      },
      // Rutas para padres
      { 
        path: 'my-children', 
        loadComponent: () => import('./parents/my-children/my-children.component').then(m => m.MyChildrenComponent),
        canActivate: [RoleGuard],
        data: { roles: ['PARENT'] }
      },
      { 
        path: 'children-grades', 
        loadComponent: () => import('./parents/children-grades/children-grades.component').then(m => m.ChildrenGradesComponent),
        canActivate: [RoleGuard],
        data: { roles: ['PARENT'] }
      },
      { 
        path: 'children-attendance', 
        loadComponent: () => import('./parents/children-attendance/children-attendance.component').then(m => m.ChildrenAttendanceComponent),
        canActivate: [RoleGuard],
        data: { roles: ['PARENT'] }
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
