import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {
  productoSeleccionado: any = null;
  modalActivo = false;
  productosRegistrados: any[] = [];
  message: string = '';
  enabledButton = false;
  maxCantidad: any;
  habilitar = true;
  products: any [] = []

  constructor(private _productService: ProductsService) {}

  ngOnInit(): void {
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

  actualizarPrecioTotal() {
    this.productoSeleccionado.precioTotal =
      this.productoSeleccionado.precio * this.productoSeleccionado.cantidad;
    this.productoSeleccionado.disponible =
      this.productoSeleccionado.disponible +
      this.productoSeleccionado.cantidadAnterior -
      this.productoSeleccionado.cantidad;
  }

  calcularPrecioTotal(cantidad: number) {
    return this.productoSeleccionado.precio * cantidad;
  }
  abrirModal(producto: any) {
    this.habilitar = true;
    this.productoSeleccionado = producto;
    const productoEncontrado = this.products.find(
      (producto) => producto.nombre == this.productoSeleccionado.nombre
    );
    if (
      Number.isNaN(productoEncontrado?.disponible) ||
      productoEncontrado?.disponible == 0
    ) {
      this.modalActivo = false;
      this.message = '* Producto agotado!!';
      setTimeout(() => {
        this.message = '';
      }, 2000);
    } else {
      this.modalActivo = true;
    }
  }
  cerrarModal() {
    this.enabledButton = false;
    this.modalActivo = false;
    this.productoSeleccionado.cantidad = 0;
  }
  incrementarCantidad() {
    this.habilitar = false;
    this.maxCantidad = this.productoSeleccionado.cantidad;
    const nuevo = this.maxCantidad + 1;
    if (nuevo == this.productoSeleccionado.disponible) {
      this.enabledButton = true;
    } else {
      this.enabledButton = false;
    }

    this.productoSeleccionado.cantidad++;
    this.productoSeleccionado.precioTotal =
      this.productoSeleccionado.cantidad * this.productoSeleccionado.precio;
  }

  decrementarCantidad() {
    this.enabledButton = false;
    if (this.productoSeleccionado.cantidad > 0) {
      this.productoSeleccionado.cantidad--;
      this.productoSeleccionado.precioTotal =
        this.productoSeleccionado.cantidad * this.productoSeleccionado.precio;
    }
    if (this.productoSeleccionado.cantidad == 0) {
      this.habilitar = true;
    }
  }
  registrarProducto() {
    const { nombre, cantidad, precioTotal } = this.productoSeleccionado;
    const productoEncontrado = this.products.find(
      (producto) => producto.nombre === nombre
    );
    if (productoEncontrado) {
      productoEncontrado.disponible -= cantidad;
    }
    this.productosRegistrados.push({ nombre, cantidad, precioTotal });
    this.modalActivo = false;
    this.enabledButton = false;
    this.productoSeleccionado.cantidad = 0;
  }
  eliminarProducto(producto: any) {
      const productoEliminado = this.productosRegistrados[producto];
      const productoOriginal = this.products.find(
        (p) => p.nombre === productoEliminado.nombre
      );
      console.log(productoOriginal)
    const index = this.productosRegistrados.indexOf(producto);
    if (index > -1) {
      this.productosRegistrados.splice(index, 1);
    }

  }
  borrarTabla() {
    this.productosRegistrados = [];
  }
  calcularTotal() {
    let total = 0;
    this.productosRegistrados.forEach((producto) => {
      total += producto.precioTotal;
    });
    return total;
  }
}
