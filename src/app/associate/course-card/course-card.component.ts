import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FirebaseService } from '../../services/firestore.service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent {
  @Input() course: any;
  @Output() downloadSyllabusEvent = new EventEmitter<string>();
  firebaseService = inject(FirebaseService);


  downloadSyllabus(courseCode: string): void {
    this.downloadSyllabusEvent.emit(courseCode);
  }

}
