import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-info-product',
  templateUrl: './info-product.component.html',
  styleUrls: ['./info-product.component.scss'],
})
export class InfoProductComponent implements OnInit {
  products: any[] = [];
  modalActivoEliminar = false;
  idObtenido: any;

  constructor(
    private _productService: ProductsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this._productService.getProducts().subscribe((data) => {
      this.products = [];
      data.forEach((element: any) => {
        this.products.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }
  abrirModalEliminar(id: string) {
    this.idObtenido = id;
    this.modalActivoEliminar = true;
  }
  cerrarModalEliminar() {
    this.modalActivoEliminar = false;
  }
  eliminarProducto2() {
    this._productService.deleteProducts(this.idObtenido).then(() => {
      this.modalActivoEliminar = false;
      this.toastr.error(
        'El producto fue eliminado con exito',
        'Producto eliminado'
      );
    });
  }
}
