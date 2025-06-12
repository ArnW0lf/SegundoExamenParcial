import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherListComponent } from './teacher-list/teacher-list';
import { TeacherFormComponent } from './teacher-form/teacher-form';

const routes: Routes = [
  { path: '', component: TeacherListComponent },
  { path: 'create', component: TeacherFormComponent, data: { mode: 'create' } },
  { path: 'edit/:id', component: TeacherFormComponent, data: { mode: 'edit' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule { }
