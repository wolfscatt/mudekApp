import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firestore.service';
import { Course } from '../associate/course-management/course';

@Component({
  selector: 'app-head-of-department',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './head-of-department.component.html',
  styleUrl: './head-of-department.component.css',
  providers: [FirebaseService]
})
export class HeadOfDepartmentComponent implements OnInit {
  fb = inject(FormBuilder);
  firebaseService = inject(FirebaseService);

  currentCourse: Course = null;
  courses: Course[] = [];
  pendingApprovals: any[] = [];
  approvedApprovals: any[] = [];
  rejectedApprovals: any[] = [];
  filter = 'pending';

  form = this.fb.group({
    approvalStatus: this.fb.array([]),
    approval: ['pending', Validators.required]
  });

  ngOnInit() {
    this.getDataFromCourses();
    console.log(this.courses);
  }


  getDataFromCourses(){
    this.firebaseService.getData('courses').subscribe(data => {
      data.forEach(form => {
        this.courses.push(form);
      });
    });
  }

  getDataFromAssociates(){
    this.firebaseService.getData('associates').subscribe(data => {
      data.forEach(form => {
        if (form.approval === 'approved') {
          this.approvedApprovals.push(form);
        } else if (form.approval === 'rejected') {
          this.rejectedApprovals.push(form);
        } else {
          this.pendingApprovals.push(form);
        }
      });
    });
  }

  loadForms(){

  }
  getCourse(course: Course){
    this.currentCourse = course;
  }

  submitForm(){
    const formData = this.form.getRawValue();
      if (formData.approval === 'approved' || formData.approval === 'rejected') {
        const courses = this.courses;
        const approvalData = {
          courses,
          approval: formData.approval
        };

        this.firebaseService.addData('associates', approvalData)
          .subscribe(
            () => console.log(`Course ${this.currentCourse.courseName} ${approvalData.approval} successfully`),
            error => console.error('Error adding data: ', error)
          );
      }
    this.loadForms(); 
  }
 
  setFilter(filter: string) {
    this.filter = filter;

    // Load forms based on the new filter
    if (this.filter === 'pending') {
      this.pendingApprovals.forEach(form => {
        const group = this.fb.group({
          course: [form.courseName],
          schoolYear: [form.courseYear],
          semester: [form.courseSemester],
          approval: ['pending', Validators.required]
        });
      });
    } else if (this.filter === 'approved') {
      this.approvedApprovals.forEach(form => {
        const group = this.fb.group({
          course: [form.courseName],
          schoolYear: [form.courseYear],
          semester: [form.courseSemester],
          approval: ['approved', Validators.required]
        });
      });
    } else if (this.filter === 'rejected') {
      this.rejectedApprovals.forEach(form => {
        const group = this.fb.group({
          course: [form.courseName],
          schoolYear: [form.courseYear],
          semester: [form.courseSemester],
          approval: ['rejected', Validators.required]
        });
      });
    }
  }

}
