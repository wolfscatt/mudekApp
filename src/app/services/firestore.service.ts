import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  addData(collectionName: string, data: any) {
    const coll = collection(this.firestore, collectionName);
    return addDoc(coll, data);
  }
}
