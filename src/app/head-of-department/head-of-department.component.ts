import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firestore.service';

@Component({
  selector: 'app-head-of-department',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './head-of-department.component.html',
  styleUrl: './head-of-department.component.css',
  providers: [FirebaseService]
})
export class HeadOfDepartmentComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private firestoreService: FirebaseService) {
    this.form = this.fb.group({
      approvalStatus: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadForms();
  }

  get approvalStatus() {
    return this.form.get('approvalStatus') as FormArray;
  }

  loadForms() {
    // Firestore'dan verileri çekme işlemi
    this.firestoreService.getData('associates').subscribe(data => {
      data.forEach(form => {
        const group = this.fb.group({
          course: [form.course],
          schoolYear: [form.schoolYear],
          semester: [form.semester],
          approval: ['pending'] // initial value
        });
        this.approvalStatus.push(group);
      });
    });
  }

  submitApproval() {
    const formData = this.form.value;
    console.log('Form data: ', formData);
    // Firestore'a verileri kaydetme işlemi
    // this.firestoreService.updateData('associates', formData)
    //   .then(() => console.log('Data updated successfully'))
    //   .catch(err => console.error('Error updating data: ', err));
  }

  rejectForm() {
    // Geri gönderme işlemi
    console.log('Form rejected');
  }

}
