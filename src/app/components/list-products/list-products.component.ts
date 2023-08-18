import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { ReportesService } from 'src/app/services/reportes.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { RegistrosService } from 'src/app/services/registros.service';
import { ComunicationService } from 'src/app/services/comunication.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { DailyService } from 'src/app/services/daily.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
  animations: [
    trigger('slideInFromRight', [
      state('void', style({ transform: 'translateX(100%)' })),
      state('*', style({ transform: 'translateX(0)' })),
      transition(':enter', animate('300ms ease-in-out')),
      transition(':leave', animate('300ms ease-in-out')),
    ]),
  ],
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
  daily: any[] = [];
  registrarActivo = false;
  pagarModal = false;
  total: number = 0
  idp = ''
  ganancia: number = 0

  valorRestado: any;
  resultado: number = 0;

  dataUser: any;

  valor = false;
  esPoker = false;
  limitarClick = false;
  cantidadOriginal: number = 0;

  constructor(
    private afAuth: AngularFireAuth,
    private _productService: ProductsService,
    private _reportes: ReportesService,
    private _daily: DailyService,
    private toastr: ToastrService,
    private router: Router,
    private _registros: RegistrosService,
    private _comunication: ComunicationService
  ) {}

  ngOnInit(): void {
    this._comunication.valorEnviado.subscribe((valor: boolean) => {
      this.valor = valor;
    });
    this.getDaily();
    this.getProducts();
    // this.cargarProductosRegistrados();
    this.afAuth.currentUser.then((data) => {
      if (data) {
        this.dataUser = data;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  // mostrarInventario(){
  //   this.mostrar = !this.mostrar
  // }
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
  getDaily() {
    this._daily.obtDaily().subscribe((data) => {
      this.daily = []
      data.forEach((element: any) => {
        this.daily.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
        console.log(this.daily)
        let totalp = 0
        this.daily.forEach(p => {
          totalp += p.precioTotal
        })
        this.total = totalp
        let gana = 0
          this.daily.forEach(g => {
            gana += g.ganancia
          })
          this.ganancia = gana
      })
    })
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
    this.pagarModal = false
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
  // guardarEnLocalStorage() {
  //   localStorage.setItem(
  //     'productosRegistrados',
  //     JSON.stringify(this.productosRegistrados)
  //   );
  // }
  // cargarProductosRegistrados() {
  // const productosRegistrados = localStorage.getItem('productosRegistrados');
  // if (productosRegistrados) {
  //   this.productosRegistrados = JSON.parse(productosRegistrados);
  //  }
  // }
  registrarProducto() {
    // this.guardarEnLocalStorage();
    let {
      id,
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
    const pago = false;
    const nota = '';
    const precioTotalCompra = cantidad * precioCompra;
    const ganancia = precioTotal - precioTotalCompra;
    const cantidadTotal = cantidad + this.cantidadOriginal;
    this.productosRegistrados.push({
      nombre,
      cantidad,
      descripcion,
      disponible,
      imagenes,
      precio,
      precioCompra,
      precioTotalCompra,
      ganancia,
      precioTotal,
      cantidadTotal,
      pago,
      // nota,
    });
    // const obj = this.productosRegistrados[0];
    const gan = this.productoSeleccionado.precio - this.productoSeleccionado.precioCompra
    const prod = {
      nombre: this.productoSeleccionado.nombre,
      cantidad: this.productoSeleccionado.cantidad,
      descripcion: this.productoSeleccionado.descripcion,
      disponible: this.productoSeleccionado.disponible,
      precio: this.productoSeleccionado.precio,
      precioTotal: this.productoSeleccionado.precioTotal,
      precioCompra: this.productoSeleccionado.precioCompra,
      pago: false,
      ganancia: gan * cantidad
        }
    console.log('proggg', this.productoSeleccionado)
    this._daily.agregarDaily(prod).then(() => {
      console.log('producto agregado');
    });
    this.modalActivo = false;
    this.enabledButton = false;
    this.productoSeleccionado.cantidad = 0;
    this.productoSeleccionado.precioTotal = 0;
  }
  eliminarProducto(id: string) {
    this._daily
      .deleteDaily(id)
      .then(() => {
        console.log('Eliminado exitosamente');
      })
      .catch((error) => {
        console.error('Error al eliminar:', error);
      });
  }
  // borrarTabla() {
  //   this.getProducts();
  //   this.productosRegistrados = [];
  //   this.toastr.error('Todos los productos fueron eliminados', 'Eliminados');
  //   this.valorRestado = null;
  //   this.resultado = 0;
  // }
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
    // if (this.valorRestado >= this.calcularTotal()) {
    //   this.resultado = Math.abs(this.calcularTotal() - this.valorRestado);
    // } else {
    //   this.resultado = 0;
    // }
    // this.resultado = this.productoSeleccionado.precioTotal - this.valorRestado;
    // if (this.resultado < 0) {
    //   this.resultado = 0;
    // }
  }
  agregarReporte() {

    this.limitarClick = true;
    setTimeout(() => {
      this.limitarClick = false;
    }, 2000);

    console.log(this.productosRegistrados);
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
    const precioTcompra = this.productosRegistrados.map(
      (p) => p.precioTotalCompra
    );

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
    this._daily.deleteAllDaily().then(() => {});
  }
  abrirPago(id: string) {
    this.idp = id
    this.pagarModal = true
  }
  actualizar() {
    const pagar = {
      pago: true
    }
    this._daily.updateDaily(this.idp, pagar).then(() => {
      console.log('actualizado')
    })
    this.pagarModal = false
  }
}
