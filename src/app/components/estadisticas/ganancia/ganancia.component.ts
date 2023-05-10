import { Component, IterableDiffers, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-ganancia',
  templateUrl: './ganancia.component.html',
  styleUrls: ['./ganancia.component.scss'],
})
export class GananciaComponent implements OnInit {
  products: any[] = [];
  modalActivoEliminar = false;
  idObtenido: any;
  invertido: any
  ganancia: any

  constructor(
    private _productService: ProductsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProducts()
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

      for (const item of this.products) {
        const precioCompra = item.precioCompra
        const disponible = item.disponible
        const precio = item.precio
        const invertido = precioCompra * disponible
        const venta = precio * disponible
        const ganancia = venta - invertido
        item.invertido = invertido
        item.venta = venta
        item.ganancia = ganancia
      }
      console.log(this.products);
      const invertido = this.products.reduce(
        (acumulador, producto) => acumulador + producto.invertido,
        0
      );
      this.invertido = invertido
      const ganancia = this.products.reduce(
        (acumulador, producto) => acumulador + producto.ganancia,
        0
      );
      this.ganancia = ganancia
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
    console.log(this.idObtenido);
    this._productService.deleteProducts(this.idObtenido).then(() => {
      this.modalActivoEliminar = false;
      this.toastr.error(
        'El producto fue eliminado con exito',
        'Producto eliminado'
      );
      console.log('deleted...');
    });
  }
}
