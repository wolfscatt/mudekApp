import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from './course';
import { FirebaseService } from '../../services/firestore.service';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.css',
  providers: [FirebaseService]
})
export class CourseManagementComponent {

  fb = inject(FormBuilder);
  firebaseService = inject(FirebaseService)
  courses: Course[] = [];
  //learningOutcomes: string[] = [];

  courseForm = this.fb.group({
    courseYear: ['', [Validators.required]],
    courseSemester: ['', [Validators.required]],
    courseName: ['', [Validators.required]],
    courseCode: ['', [Validators.required]],
    courseCredit: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    courseDescription: ['', [Validators.required]],
    courseLearningOutcomes: this.fb.array([]),
    courseSyllabus: [null, [Validators.required]],
    courseAssesments: [null, [Validators.required]],
    courseInstructor: ['', [Validators.required]]
  });


  get courseLearningOutcomes() {
    return this.courseForm.get('courseLearningOutcomes') as FormArray;
  }


  addLearningOutcome(): void {
    this.courseLearningOutcomes.push(this.fb.control('', Validators.required));
  }

  removeLearningOutcome(index: number): void {
    this.courseLearningOutcomes.removeAt(index);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
  if (file) {
    this.courseForm.patchValue({ courseSyllabus: file });

    // Clear any previous error state related to courseSyllabus
    this.courseForm.get('courseSyllabus')?.setErrors(null);
  }
  }

  uploadFirebase(): void {
    if (this.courseForm.valid) {
      const formValue = this.courseForm.getRawValue();
      const learningOutcomesWithPValues = this.courseLearningOutcomes.value!.map((outcome: string) => {
        const pValues: { [key: string]: number | null } = {};
        for (let i = 1; i <= 12; i++) {
          pValues[`P${i}`] = null;
        }
        return { outcome, pValues };
      });

      const courseData: Course = new Course(
        formValue.courseYear!,
        formValue.courseSemester!,
        formValue.courseName!,
        formValue.courseCode!,
        formValue.courseCredit!,
        formValue.courseDescription!,
        learningOutcomesWithPValues,
        formValue.courseSyllabus!,
        formValue.courseAssesments!,
        formValue.courseInstructor!
      );

      if (typeof formValue.courseSyllabus !== 'string') {
        this.firebaseService.uploadFile('syllabus/' + courseData.courseCode, formValue.courseSyllabus!)
          .subscribe(
            syllabusUrl => {
              courseData.courseSyllabus = syllabusUrl;
              this.addToFirestore(courseData);
              console.log(courseData);
            },
            error => {
              console.error('Error uploading syllabus:', error);
            }
          );
      } else {
        console.log(courseData);
        this.addToFirestore(courseData);
      }
    }
  }

  private addToFirestore(courseData: Course): void {
    this.firebaseService.addData('courses', courseData.toJSON())
      .subscribe(() => {
        this.courses.push(courseData);
        console.log('Course added successfully:', courseData);
        this.resetForm();
      },
      error => {
        console.error('Error adding course:', error);
      }
    );
      
  }
  

  onSubmit(): void {
    this.uploadFirebase();
  }

  resetForm(): void {
    this.courseForm.reset();
    this.courseLearningOutcomes.clear();
  }
}
