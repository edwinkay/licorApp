import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  createProduct: FormGroup;
  subbmited = false;
  id: string | null;

  constructor(
    private _productService: ProductsService,
    private fb: FormBuilder,
    private aRouter: ActivatedRoute) {
    this.createProduct = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precioCompra: ['', Validators.required],
      precioVenta: ['', Validators.required],
      imagenes: [''],
      disponible: ['', Validators.required],
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.EXeditProducto();
    this.obtener();
  }
  verificar(){
      if (this.createProduct.invalid) {
        this.subbmited = true;
        setTimeout(() => {
          this.subbmited = false
        }, 3000)
        return
      }
  }


  agregarEditarProducto() {
    //se valida todos los campos
    this.subbmited = true;

    if (this.createProduct.invalid) {
      return;
    }
    if (this.id === null) {
      this.agregarProducto();
    } else {
      this.editarProducto(this.id);
    }
  }
  agregarProducto() {
    const producto: any = {
      nombre: this.createProduct.value.nombre,
      descripcion: this.createProduct.value.descripcion,
      precioCompra: this.createProduct.value.precioCompra,
      precio: this.createProduct.value.precioVenta,
      cantidad: 0,
      precioTotal: 0,
      imagenes: this.createProduct.value.imagenes,
      disponible: this.createProduct.value.disponible,
    };
    this._productService.agregarproducto(producto).then(() => {
      console.log('registrado con exito')
    })
  }
  editarProducto(id: string) {
    const producto: any = {
      nombre: this.createProduct.value.nombre,
      descripcion: this.createProduct.value.descripcion,
      precioCompra: this.createProduct.value.precioCompra,
      precioVenta: this.createProduct.value.precioVenta,
      imagenes: this.createProduct.value.imagenes,
      disponible: this.createProduct.value.disponible,
    };
  }
  EXeditProducto() {}
  obtener() {}
}
