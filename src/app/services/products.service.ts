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
  getProducto(id: string): Observable<any> {
    return this.firestore.collection('productos').doc(id).snapshotChanges();
  }
  agregarproducto(producto: any): Promise<any> {
    return this.firestore.collection('productos').add(producto);
  }
  deleteProducts(id: string): Promise<any> {
    return this.firestore.collection('productos').doc(id).delete();
  }
  update(id: string, data: any): Promise<any> {
    return this.firestore.collection('productos').doc(id).update(data);
  }
  updateProducts(products: any[]): Promise<void> {
    const batch = this.firestore.firestore.batch();

    products.forEach((product) => {
      const docRef = this.firestore.collection('productos').doc(product.id);
      batch.update(docRef.ref, product);
    });

    return batch.commit();
  }
}
