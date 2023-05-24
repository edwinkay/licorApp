import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  constructor(private firestore: AngularFirestore) {}

  addReport(producto: any): Promise<any> {
    return this.firestore.collection('reportes').add(producto);
  }
  getReportes(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('reportes', (ref) => ref.orderBy('fechaCreacion', 'desc')).snapshotChanges();
  }
  obtReports(): Observable<any> {
    return this.firestore
      .collection('reportes', (ref) => ref.orderBy('fechaCreacion', 'desc'))
      .snapshotChanges();
  }
  deleteProducts(id: string): Promise<any> {
    return this.firestore.collection('reportes').doc(id).delete();
  }
  deleteAllReports(): any {
    const batch = this.firestore.firestore.batch();
    return this.firestore
      .collection('reportes')
      .ref.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      .catch((error) => {
        console.error('Error al eliminar los reportes:', error);
      });
  }
}
