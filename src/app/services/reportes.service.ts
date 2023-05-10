import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  constructor(private firestore: AngularFirestore) {}

  addReport(producto: any): Promise<any> {
    return this.firestore.collection('reportes').add(producto);
  }
  obtReports(): Observable<any> {
    return this.firestore
      .collection('reportes', (ref) => ref.orderBy('fechaCreacion', 'desc'))
      .snapshotChanges();
  }
  deleteProducts(id: string): Promise<any> {
    return this.firestore.collection('reportes').doc(id).delete();
  }
}
