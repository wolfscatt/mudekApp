import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class AssociateComponent implements OnInit{

  form: FormGroup;
  learningOutcomes: FormArray;
  assessments: FormArray;
  displayedColumns: string[];
  assessmentTypes: string[] = ['Vize', 'Final', 'Ödev1', 'Ödev2', 'Proje', 'Uygulama'];

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

  ngOnInit(): void {
    // Initialize assessments with predefined types
    this.assessmentTypes.forEach(type => {
      this.assessments.push(this.fb.group({
        type: [type],
        percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
      }));
    });
  }

  addLearningOutcome() {
    this.learningOutcomes.push(this.fb.group({ outcome: [''] }));
  }

  // addAssessment() {
  //   this.assessments.push(this.fb.group({ type: [''], score: [''] }));
  // }

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
