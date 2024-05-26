import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-associate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './associate.component.html',
  styleUrl: './associate.component.css',
  providers: [FirestoreService]
})
export class AssociateComponent {

  form: FormGroup;
  learningOutcomes: FormArray;
  assessments: FormArray;
  displayedColumns: string[];

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService) {
    this.form = this.fb.group({
      schoolYear: [''],
      semester: [''],
      course: [''],
      learningOutcomes: this.fb.array([]),
      assessments: this.fb.array([]),
      document: [''],
      confirmation: [false]
    });

    this.learningOutcomes = this.form.get('learningOutcomes') as FormArray;
    this.assessments = this.form.get('assessments') as FormArray;

    this.displayedColumns = ['outcome', ...Array.from({length: 12}, (_, i) => 'P' + (i + 1))];
  }

  addLearningOutcome() {
    this.learningOutcomes.push(this.fb.group({ outcome: [''] }));
  }

  addAssessment() {
    this.assessments.push(this.fb.group({ type: [''], score: [''] }));
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    console.log(files);
  }

  submit() {
    const formData = this.form.value;
    this.firestoreService.addData('associates', formData)
      .then(() => console.log('Data added successfully'))
      .catch(err => console.error('Error adding data: ', err));
  }

}
