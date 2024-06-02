import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from './course';
import { FirestoreService } from '../../services/firestore.service';

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
  firestoreService = inject(FirestoreService)
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
      this.firestoreService.addData('courses', courseData.toJSON())
      .then(() => {
        // Firestore'a veri eklendikten sonra başarıyla eklendiğini kabul edip yerel listeye ekleyebiliriz
        this.courses.push(courseData);
        console.log('Course added successfully:', courseData);
      })
      .catch(error => {
        console.error('Error adding course:', error);
      });
    }
  }
}
