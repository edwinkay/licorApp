import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DailyService {
  constructor(private firestore: AngularFirestore) {}

  agregarDaily(daily: any): Promise<any> {
    return this.firestore.collection('daily').add(daily);
  }
  obtDaily(): Observable<any> {
    return this.firestore.collection('daily').snapshotChanges();
  }
  deleteDaily(id: string): Promise<any> {
    return this.firestore.collection('daily').doc(id).delete();
  }
  updateDaily(id: string, data: any): Promise<any> {
    return this.firestore.collection('daily').doc(id).update(data);
  }
  deleteAllDaily(): any {
    const batch = this.firestore.firestore.batch();
    return this.firestore
      .collection('daily')
      .ref.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      .catch((error) => {
        console.error('Error al eliminar los daily:', error);
      });
  }
}
