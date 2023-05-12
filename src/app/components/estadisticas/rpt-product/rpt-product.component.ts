import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-rpt-product',
  templateUrl: './rpt-product.component.html',
  styleUrls: ['./rpt-product.component.scss'],
})
export class RptProductComponent implements OnInit {
  products: any[] = [];
  totalVenta: any;
  ganancia: any;

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
        console.log(this.products);
        for (const item of this.products) {
          const disponible = item.disponible
          const disponibleTotal = item.disponibleTotal
          const precioC = item.precioCompra;
          const cantidad = item.cantidadTotal;
          const precio = item.precio;
          const totalVenta = precio * cantidad;
          const micompra = precioC * cantidad;
          const ganancia = totalVenta - micompra;
          const cantidadVendida = disponibleTotal - disponible
          item.cantidadTotal = cantidadVendida
          item.totalVenta = totalVenta;
          item.ganancia = ganancia;
        }
        const totalVenta = this.products.reduce(
          (acumulador, producto) => acumulador + producto.totalVenta,
          0
        );
        this.totalVenta = totalVenta;

        const ganancia = this.products.reduce(
          (acumulador, producto) => acumulador + producto.ganancia,
          0
        );
        this.ganancia = ganancia
      });
    });
  }
}
