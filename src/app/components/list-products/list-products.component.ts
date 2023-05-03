import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {
  selectedProduct: any;
  selectedProductPrice: any;

  products = [
    {
      nombre: 'Aguardiente caucano',
      descripcion: 'tradicional',
      precio: 16500,
      cantidad: 0,
      precioTotal: 0,
    },
    {
      nombre: 'Ron',
      descripcion: 'Viejo de caldas',
      precio: 22500,
      cantidad: 0,
      precioTotal: 0,
    },
  ];

  productos = [
    {
      nombre: 'Vodka',
      descripcion: 'Vodka premium importado de Rusia',
      precio: 25.0,
      cantidad: 0,
      precioTotal: 0,
    },
    {
      nombre: 'Gin',
      descripcion: 'Gin elaborado con enebro y botánicos seleccionados',
      precio: 30.0,
      cantidad: 0,
      precioTotal: 0,
    },
    {
      nombre: 'Ron',
      descripcion: 'Ron añejo de origen cubano',
      precio: 35.0,
      cantidad: 0,
      precioTotal: 0,
    },
    {
      nombre: 'Whisky',
      descripcion: 'Whisky escocés de malta con sabor a turba',
      precio: 40.0,
      cantidad: 0,
      precioTotal: 0,
    },
    {
      nombre: 'Tequila',
      descripcion: 'Tequila reposado de agave azul',
      precio: 45.0,
      cantidad: 0,
      precioTotal: 0,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  actualizarPrecioTotal(producto: any) {
    producto.precioTotal = producto.cantidad * producto.precio;
  }

  incrementarCantidad(producto: any) {
    producto.cantidad++;
    this.actualizarPrecioTotal(producto);
  }

  decrementarCantidad(producto: any) {
    if (producto.cantidad > 0) {
      producto.cantidad--;
      this.actualizarPrecioTotal(producto);
    }
  }
  agregarProducto() {
    this.productos.push({
      nombre: '',
      descripcion: '',
      precio: 0,
      cantidad: 0,
      precioTotal: 0,
    });
  }
  eliminarProductos() {
    this.productos = [];
  }
  eliminarProducto(producto: any) {
    const index = this.productos.indexOf(producto);
    if (index !== -1) {
      this.productos.splice(index, 1);
    }
  }
  onProductSelected(event: any) {
    // Obtén el producto seleccionado
    const selectedProduct = event.target.value;
    const pattern = /^[\d]+:\s*(.*)$/;
    const match = selectedProduct.match(pattern);
    const productName = match[1];
    // Busca el precio del producto seleccionado en el array de productos

    const product = this.products.find((p) => p.nombre === productName);
    // Actualiza la variable de producto seleccionado y su precio
    console.log(product?.precio);
    this.selectedProductPrice = product?.precio;
  }
}
