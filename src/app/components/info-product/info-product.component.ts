import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-info-product',
  templateUrl: './info-product.component.html',
  styleUrls: ['./info-product.component.scss'],
})
export class InfoProductComponent implements OnInit {
  products: any [] = []
  constructor(private _productService: ProductsService) {}

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this._productService.getProducts().subscribe(data => {
      this.products = []
      data.forEach((element: any) => {
         this.products.push({
           id: element.payload.doc.id,
           ...element.payload.doc.data(),
         });
         console.log(this.products)
      })
    })
  }
  eliminarProducto(id: string){
    this._productService.deleteProducts(id).then(() => {
      console.log('deleted...');
    })
  }
}
