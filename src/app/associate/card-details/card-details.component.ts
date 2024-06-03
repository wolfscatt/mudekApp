import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from '../../services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../course-management/course';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from 'express';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.css',
  providers: [FirebaseService]
})
export class CardDetailsComponent implements OnInit{
 
  firestoreService = inject(FirebaseService);
  router = inject(Router)
  route = inject(ActivatedRoute);
  course: Course | undefined = new Course("","","","","","",[],"","");

  ngOnInit(): void {
    const courseCode = this.route.snapshot.paramMap.get('courseCode');
    console.log(courseCode);
    if (courseCode) {
      this.fetchCourseDetails(courseCode);
    }
  }

  fetchCourseDetails(courseCode: string): void {
    this.firestoreService.getData('courses').subscribe((courses: Course[]) => {
      this.course = courses.find(course => course.courseCode === courseCode);
    });
  }

  updateCourse(): void {
    if (this.course) {
      // Update course details
      this.firestoreService.updateData('courses',this.course.courseCode!, this.course)
        .then(() => {
          console.log('Course updated successfully:', this.course);
          this.fetchCourseDetails(this.course!.courseCode!);
          // Burada başka bir işlem yapabilirsiniz, mesela başarılı güncelleme mesajı gösterebilirsiniz.
        })
        .catch(error => {
          console.error('Error updating course:', error);
        });
    }
  }

  deleteCourse(): void {
    if (this.course) {
      // Delete course from Firebase
      this.firestoreService.deleteData('courses', this.course.courseCode!)
        .then(() => {
          console.log('Course deleted successfully');
          this.router.navigate(['/associate']);
          // Burada başka bir işlem yapabilirsiniz, mesela silme başarılı mesajı gösterebilirsiniz.
        })
        .catch(error => {
          console.error('Error deleting course:', error);
        });
    }
  }
}
