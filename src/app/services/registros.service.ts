import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrosService {
  constructor(private firestore: AngularFirestore) {}

  addRegistros(registros: any): Promise<any> {
    return this.firestore.collection('registros').add(registros);
  }
  obtRegistros(): Observable<any> {
    return this.firestore
      .collection('registros')
      .snapshotChanges();
  }
  updateProducts(registros: any[]): Promise<void> {
    const batch = this.firestore.firestore.batch();

    registros.forEach((registro) => {
      const docRef = this.firestore.collection('registros').doc(registro.id);
      batch.update(docRef.ref, registro);
    });

    return batch.commit();
  }
  deleteAllRegistros(): void {
    const registrosRef = this.firestore.collection('registros');
    const registros$: Observable<any[]> = registrosRef.snapshotChanges();

    registros$.subscribe((registros) => {
      registros.forEach((registros) => {
        this.firestore
          .collection('registros')
          .doc(registros.payload.doc.id)
          .delete();
      });
    });
  }
}
