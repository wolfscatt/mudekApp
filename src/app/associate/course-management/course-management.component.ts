import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from './course';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css'
})
export class CourseManagementComponent {

  fb = inject(FormBuilder);
  courses: Course[] = [];

  courseForm = this.fb.group({
    courseYear: ['', [Validators.required]],
    courseSemester: ['', [Validators.required]],
    courseName: ['', [Validators.required]],
    courseCode: ['', [Validators.required]],
    courseCredit: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    courseDescription: ['', [Validators.required]],
    courseLearningOutcomes: ['', [Validators.required]],
    courseAssessments: ['', [Validators.required]],
    courseInstructor: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.getRawValue();
      const courseData: Course = new Course(
        formValue.courseYear!,
        formValue.courseSemester!,
        formValue.courseName!,
        formValue.courseCode!,
        formValue.courseCredit!,
        formValue.courseDescription!,
        formValue.courseLearningOutcomes!,
        formValue.courseAssessments!,
        formValue.courseInstructor!
      );
      this.courses.push(courseData);
      //console.log(this.courses);
    }
  }
}
