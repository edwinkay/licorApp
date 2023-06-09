import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { ReportesService } from 'src/app/services/reportes.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { RegistrosService } from 'src/app/services/registros.service';

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

  dataUser: any;

  esPoker = false;
  limitarClick = false;
  cantidadOriginal: number = 0;

  constructor(
    private afAuth: AngularFireAuth,
    private _productService: ProductsService,
    private _reportes: ReportesService,
    private toastr: ToastrService,
    private router: Router,
    private _registros: RegistrosService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.afAuth.currentUser.then((data) => {
      if (data) {
        this.dataUser = data;
      } else {
        this.router.navigate(['/login']);
      }
    });
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
    this.enabledButton = false;
    if (
      this.productoSeleccionado.cantidad <= this.productoSeleccionado.disponible
    ) {
      this.habilitar = false;
    } else {
      this.habilitar = true;
    }
    if (
      this.productoSeleccionado.cantidad == 0 ||
      this.productoSeleccionado.cantidad == null ||
      this.productoSeleccionado.cantidad == undefined
    ) {
      this.habilitar = true;
    }
  }
  onInputChange() {
    this.habilitar = false;
  }
  calcularPrecioTotal(cantidad: number) {
    return this.productoSeleccionado.precio * cantidad;
  }
  abrirModal(producto: any) {
    this.cantidadOriginal = producto.cantidad;
    this.habilitar = true;
    this.productoSeleccionado = producto;
    this.productoSeleccionado.cantidad = 0;
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
    this.valorRestado = null;
    this.resultado = 0;
    this.productoSeleccionado.precioTotal = 0;
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
    let {id, nombre,cantidad,descripcion,disponible,imagenes,precio,precioCompra,
      precioTotal,
    } = this.productoSeleccionado;

    const productoEncontrado = this.products.find(
      (producto) => producto.nombre === nombre
    );
    if (productoEncontrado) {
      productoEncontrado.disponible -= cantidad;
      disponible = productoEncontrado.disponible;
    }
    const precioTotalCompra = cantidad * precioCompra
    const ganancia = precioTotal - precioTotalCompra;
    const cantidadTotal = cantidad + this.cantidadOriginal
    this.productosRegistrados.push({id,nombre,cantidad,descripcion,disponible,imagenes,precio,precioCompra,precioTotalCompra,ganancia,precioTotal,cantidadTotal,
    });
    console.log(this.productosRegistrados)
    this.modalActivo = false;
    this.enabledButton = false;
    this.productoSeleccionado.cantidad = 0;
    this.productoSeleccionado.precioTotal = 0;
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
    this.valorRestado = null;
    this.resultado = 0;
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
  restarValor() {
    if (this.valorRestado >= this.calcularTotal()) {
      this.resultado = Math.abs(this.calcularTotal() - this.valorRestado);
    } else {
      this.resultado = 0;
    }
  }
  agregarReporte() {
    this.limitarClick = true;
    setTimeout(() => {
      this.limitarClick = false;
    }, 2000);


    console.log(this.productosRegistrados)
    this._productService
      .updateProducts(this.productosRegistrados)
      .then(() => {});

    const id = this.productosRegistrados.map((n) => n.id);
    const nombres = this.productosRegistrados.map((n) => n.nombre);
    const cantidades = this.productosRegistrados.map((n) => n.cantidad);
    const disponibles = this.productosRegistrados.map((n) => n.disponible);
    const descripciones = this.productosRegistrados.map((n) => n.descripcion);
    const precios = this.productosRegistrados.map((n) => n.precio);
    const precioCompras = this.productosRegistrados.map((p) => p.precioCompra);
    const precioTotal = this.productosRegistrados.map((p) => p.precioTotal);
    const ganancia = this.productosRegistrados.map((p) => p.ganancia);
    const precioTcompra = this.productosRegistrados.map((p) => p.precioTotalCompra);

    const rpt: any = {
      nombre: nombres,
      cantidad: cantidades,
      descripcion: descripciones,
      disponible: disponibles,
      precio: precios,
      precioCompra: precioCompras,
      precioTotalCompra: precioTcompra,
      ganancia: ganancia,
      precioTotal: precioTotal,
      total: this.calcularTotal(),
      fechaCreacion: new Date(),
    };

    this._reportes.addReport(rpt).then(() => {
      this.toastr.success('Registrado con exito', 'Reporte Registrado!!');
      this.productosRegistrados = [];
      this.registrarActivo = false;
    });
    // this._registros.addRegistros(rpt).then(() => {});
    this.getProducts();
    this.productoSeleccionado = null;

  }
}
