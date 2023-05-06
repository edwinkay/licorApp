import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ToastrService } from 'ngx-toastr';

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
  products: any[] = [];
  registrarActivo = false;

  valorRestado: any;
  resultado: number = 0;

  // products = [
  //   {
  //     nombre: 'Aguardiente caucano',
  //     descripcion: 'tradicional',
  //     precio: 16500,
  //     cantidad: 0,
  //     precioTotal: 0,
  //     imagen:
  //       'https://olimpica.vtexassets.com/arquivos/ids/735687-800-auto?v=637782321904170000&width=800&height=auto&aspect=true',
  //     disponible: 10,
  //   },
  //   {
  //     nombre: 'Ron',
  //     descripcion: 'Viejo de caldas',
  //     precio: 22500,
  //     cantidad: 0,
  //     precioTotal: 0,
  //     imagen:
  //       'https://d2j6dbq0eux0bg.cloudfront.net/images/30491376/1511186234.jpg',
  //     disponible: 5,
  //   },
  // ];

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
    this.registrarActivo = false;
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
    let {
      nombre,
      cantidad,
      descripcion,
      disponible,
      imagenes,
      precio,
      precioCompra,
      precioTotal,
    } = this.productoSeleccionado;
    const productoEncontrado = this.products.find(
      (producto) => producto.nombre === nombre
    );
    if (productoEncontrado) {
      productoEncontrado.disponible -= cantidad;
      disponible = productoEncontrado.disponible;
    }
    const total = this.calcularTotal();
    this.productosRegistrados.push({
      nombre,
      cantidad,
      descripcion,
      disponible,
      imagenes,
      precio,
      precioCompra,
      precioTotal,
      total,
    });
    this.modalActivo = false;
    this.enabledButton = false;
    this.productoSeleccionado.cantidad = 0;
    console.log('productos resgistrados', this.productosRegistrados);
    console.log(this.calcularTotal());
  }
  eliminarProducto(producto: any) {
    const index = this.productosRegistrados.indexOf(producto);
    if (index > -1) {
      this.productosRegistrados.splice(index, 1);
      this.toastr.error(
        'El producto fue eliminado con exito',
        'Producto eliminado'
      );
    }
    const productoEncontrado = this.products.find(
      (producto) => producto.nombre === this.productoSeleccionado.nombre
    );
    if (productoEncontrado) {
      productoEncontrado.disponible += producto.cantidad;
    }
  }
  borrarTabla() {
    this.getProducts();
    this.productosRegistrados = [];
    this.toastr.error('Todos los productos fueron eliminados', 'Eliminados');
  }
  calcularTotal() {
    let total = 0;
    this.productosRegistrados.forEach((producto) => {
      total += producto.precioTotal;
    });
    return total;
  }
  modalRegistrar() {
    this.registrarActivo = true;
  }
  restarValor(){

  }
}
