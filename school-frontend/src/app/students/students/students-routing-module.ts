import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list';
import { StudentFormComponent } from './student-form/student-form';
// import { StudentDetailComponent } from './student-detail/student-detail.component';

const routes: Routes = [
  { path: '', component: StudentListComponent },
  { path: 'create', component: StudentFormComponent, data: { mode: 'create' } },
  { path: 'edit/:id', component: StudentFormComponent, data: { mode: 'edit' } },
  // { path: ':id', component: StudentDetailComponent }, // For viewing details
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
