import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../../services/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../course-management/course';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css'],
  providers: [FirebaseService]
})
export class CardDetailsComponent implements OnInit {

  fb = inject(FormBuilder);
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  course: Course | undefined = new Course("", "", "", "", "", "", [], "", [], "");
  loading: boolean = false; // Yükleme durumu
  errorMessage: string = ''; // Hata mesajı

  documentId: string = ''; // Firestore'da belge kimliği

  assessmentTypes = ['Vize', 'Final', 'Ödev 1', 'Ödev 2', 'Proje', 'Uygulama'];
  selectedAssessmentType: string = '';
  newAssessmentType: string = '';

  private subscriptions: Subscription = new Subscription();

  courseForm = this.fb.group({
    courseOutcomesScore: [''],
    assesmentTypes: [''],
    courseAssessmentsScore: [''],
  });

  ngOnInit(): void {
    const courseCode = this.route.snapshot.paramMap.get('courseCode');
    if (courseCode) {
      this.fetchCourseDetails(courseCode);
    }
  }

  getDocumentIdByCourseCode(collectionName: string, courseCode: string): void {
    this.firebaseService.getDocumentIdByCourseCode(collectionName, courseCode).subscribe(
      (documentId) => {
        if (documentId) {
          this.documentId = documentId;
        }
      },
      (error) => {
        console.error('Error fetching document ID:', error);
      }
    );
  }

  fetchCourseDetails(courseCode: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.subscriptions.add(
      this.firebaseService.getData('courses').subscribe(
        (courses: Course[]) => {
          const courseData = courses.find(course => course.courseCode === courseCode);
          if (courseData) {
            this.course = courseData;
          }
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'Error fetching course details';
          console.error('Error fetching course details:', error);
          this.loading = false;
        }
      )
    );
  }

  updateCourse(): void {
    if (this.course) {
      this.loading = true;
      this.errorMessage = '';
      this.subscriptions.add(
        this.firebaseService.updateData('courses', this.documentId, this.course).subscribe(
          () => {
            console.log('Course updated successfully:', this.course);
            this.loading = false;
            // Başarılı güncelleme mesajı gösterebilir veya başka bir işlem yapabilirsiniz
          },
          (error) => {
            this.errorMessage = 'Error updating course';
            console.error('Error updating course:', error);
            this.loading = false;
          }
        )
      );
    }
  }

  deleteCourse(): void {
    if (this.course) {
      this.loading = true;
      this.errorMessage = '';
      this.firebaseService.deleteData('courses', this.documentId).subscribe(
        () => {
          console.log('Course deleted successfully');
          this.loading = false;
        },

        (err) => {
          this.errorMessage = 'Error deleting course';
          console.error('Error deleting course:', err);
          this.loading = false;
        });
    }
  }

  addAssessmentType() {
    if (this.newAssessmentType) {
      this.assessmentTypes.push(this.newAssessmentType);
      this.course.courseAssesments[this.newAssessmentType] = []; // Initialize empty array for new assessment type
      this.selectedAssessmentType = '';
      this.newAssessmentType = '';
    }
  }

  removeAssessmentType(type: string) {
    if (this.assessmentTypes.includes(type)) {
      delete this.course.courseAssesments[type];
      this.assessmentTypes = this.assessmentTypes.filter(t => t !== type);
    }
  }


  ngOnDestroy(): void {
    // Bileşen yok edildiğinde tüm subscription'ları iptal et
    this.subscriptions.unsubscribe();
  }
}
