import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
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
  providers: [FirestoreService]
})
export class AssociateComponent implements OnInit{
  firestoreService = inject(FirestoreService);
  router = inject(Router);
  courses: Course[] = [];


  ngOnInit(): void {
   this.fetchCourses();
  }

  fetchCourses(){
    this.firestoreService.getData('courses').subscribe(data => {
      this.courses = data;
    });
  }

 
  goToCourseDetails(courseCode: string){
    this.router.navigate(['/associate/cardDetails', courseCode]);
  }

}
