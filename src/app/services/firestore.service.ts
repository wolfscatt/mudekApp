import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, updateDoc, doc, CollectionReference, DocumentData, deleteDoc, query, where } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Storage, uploadBytesResumable, ref, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore = inject(Firestore);
  storage = inject(Storage);

  getData(collectionName: string): Observable<any[]> {
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    return from(getDocs(coll)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
  }
  
  getDocumentIdByCourseCode(collectionName: string, courseCode: string): Observable<string | undefined> {
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    const q = query(coll, where('courseCode', '==', courseCode));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const doc = snapshot.docs[0];
        return doc ? doc.id : undefined;
      })
    );
  }


  addData(collectionName: string, data: any): Observable<string> {
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    return from(addDoc(coll, data)).pipe(
      map(docRef => docRef.id)
    );
  }

  updateData(collectionName: string, documentId: string, data: any): Observable<void> {
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    const document = doc(coll, documentId);
    return from(updateDoc(document, data));
  }

  deleteData(collectionName: string, documentId: string): Observable<void> {
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    const document = doc(coll, documentId);
    return from(deleteDoc(document));
  }

  uploadFile(filePath: string, file: File): Observable<string> {
    const fileRef = ref(this.storage, filePath);
    const task = uploadBytesResumable(fileRef, file);

    return new Observable<string>(observer => {
      task.on('state_changed',
        (snapshot) => {
          // Progress monitoring (optional)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          observer.error(error);
        },
        () => {
          getDownloadURL(fileRef).then(url => {
            observer.next(url);
            observer.complete();
          }).catch(err => {
            observer.error(err);
          });
        }
      );
    });
  }


  downloadFile(filePath: string): Observable<string> {
    const fileRef = ref(this.storage, filePath);
    return from(getDownloadURL(fileRef));
  }
}
