import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, updateDoc, doc, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

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

  updateData(collectionName: string, data: any) {
    const coll: CollectionReference<DocumentData> = collection(this.firestore, collectionName);
    const document = doc(coll, data.id);
    return updateDoc(document, data);
  }
}
