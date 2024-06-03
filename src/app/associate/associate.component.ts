import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firestore.service';
import { Course } from './course-management/course';
import { CourseCardComponent } from './course-card/course-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-associate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CourseCardComponent
  ],
  templateUrl: './associate.component.html',
  styleUrl: './associate.component.css',
  providers: [FirebaseService]
})
export class AssociateComponent implements OnInit{
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  courses: Course[] = [];


  ngOnInit(): void {
   this.fetchCourses();
  }

  fetchCourses(){
    this.firebaseService.getData('courses').subscribe(data => {
      this.courses = data;
    });
  }

 
  goToCourseDetails(courseCode: string){
    this.router.navigate(['/associate/cardDetails', courseCode]);
  }

  downloadSyllabus(courseCode: string): void {
    const course = this.courses.find(c => c.courseCode === courseCode);
    if (course && course.courseSyllabus) {
      this.firebaseService.downloadFile(course.courseSyllabus).subscribe(
        url => {
          console.log('Dosya URL\'si:', url);
          window.open(url, '_blank'); // Yeni sekmede açmak için
        },
        error => {
          console.error('Dosya indirme hatası:', error);
        }
      );
    } else {
      console.error('Kurs veya syllabus bulunamadı:', courseCode);
    }
  }

}
