import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, updateDoc, doc, CollectionReference, DocumentData, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Storage, uploadBytesResumable, ref, getDownloadURL  } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore = inject(Firestore);
  storage = inject(Storage);

  getData(collectionName: string): Observable<any[]> {
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    return new Observable(observer => {
      getDocs(coll).then(snapshot => {
        const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        observer.next(data);
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  addData(collectionName: string, data: any) {
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    return addDoc(coll, data);
  }

  updateData(collectionName: string, documentId: string, data: any){
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    const document = doc(coll, documentId);
    
    return updateDoc(document, data);
      // .then(() => {
      //   console.log(`Document with ID ${documentId} successfully updated.`);
      // })
      // .catch((error) => {
      //   console.error('Error updating document:', error);
      //   throw error; // Optional: Hata yönetimini çağıran yere aktarabilirsiniz.
      // });
  }

  deleteData(collectionName: string, documentId: string) {
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    const document = doc(coll, documentId);
    
    return deleteDoc(document);
      
  }

  uploadFile(filePath: string, file: File): Observable<string> {
    const fileRef = ref(this.storage, filePath);
    const task = uploadBytesResumable(fileRef, file);

    return new Observable<string>(observer => {
      task.on('state_changed',
        (snapshot) => {
          // Progress monitoring
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          // Handle unsuccessful uploads
          observer.error(error);
        },
        () => {
          // Handle successful uploads on complete
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
    return new Observable<string>(observer => {
      getDownloadURL(fileRef).then(url => {
        observer.next(url);
        observer.complete();
      }).catch(err => {
        observer.error(err);
      });
    });
  }
}
