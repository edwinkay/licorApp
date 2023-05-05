import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private firestore: AngularFirestore) {}

  getProducts(): Observable<any> {
    return this.firestore.collection('productos').snapshotChanges();
  }

  agregarproducto(producto: any): Promise<any> {
    return this.firestore.collection('productos').add(producto);
  }
  deleteProducts(id: string): Promise<any> {
    return this.firestore.collection('productos').doc(id).delete();
  }
}
