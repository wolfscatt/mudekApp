import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../../services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../course-management/course';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.css',
  providers: [FirebaseService]
})
export class CardDetailsComponent implements OnInit{
 
  firestoreService = inject(FirebaseService);
  route = inject(ActivatedRoute);
  course: Course | undefined = new Course("","","","","","",[],"","");

  ngOnInit(): void {
    const courseCode = this.route.snapshot.paramMap.get('courseCode');
    console.log(courseCode);
    if (courseCode) {
      this.firestoreService.getData('courses').subscribe((courses: Course[]) => {
        this.course = courses.find(course => course.courseCode === courseCode) ;
      });
    }
  }
}
