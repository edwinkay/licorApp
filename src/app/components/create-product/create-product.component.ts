import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  createProduct: FormGroup;
  subbmited: boolean = false;
  id: string | null;
  titleChange: string = 'Agregar Producto';
  urlImagen: string =
    'https://media.istockphoto.com/id/1162198273/es/vector/dise%C3%B1o-de-ilustraci%C3%B3n-vectorial-plana-icono-de-signo-de-interrogaci%C3%B3n.jpg?s=1024x1024&w=is&k=20&c=pZBCbPrSZDpGfF0OzRN78BeLUIJbiWaRxeKVO2TG7sA=';

  constructor(
    private _productService: ProductsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute
  ) {
    this.createProduct = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precioCompra: ['', Validators.required],
      precio: ['', Validators.required],
      imagenes: [''],
      disponible: ['', Validators.required],
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.EXeditProducto();
  }
  verificar() {
    if (this.createProduct.valid) {
      console.log('El formulario es válido');
      return true;
    } else {
      console.log('El formulario no es válido');
      this.subbmited = true;
      setTimeout(() => {
        this.subbmited = false;
      }, 4000);
      return false;
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
      precio: this.createProduct.value.precio,
      cantidad: 0,
      precioTotal: 0,
      imagenes: this.createProduct.value.imagenes,
      disponible: this.createProduct.value.disponible,
    };
    this._productService.agregarproducto(producto).then(() => {
      this.toastr.success('Agregado con exito!!', 'Producto Agregado');
      this.router.navigate(['/info-product']);
    });
  }
  editarProducto(id: string) {
    const producto: any = {
      nombre: this.createProduct.value.nombre,
      descripcion: this.createProduct.value.descripcion,
      precioCompra: this.createProduct.value.precioCompra,
      precio: this.createProduct.value.precio,
      imagenes: this.createProduct.value.imagenes,
      disponible: this.createProduct.value.disponible,
    };
    this._productService.update(id, producto).then(() => {
      this.toastr.info(
        'Producto modificado con exito',
        'Actualizacion Exitosa'
      );
      this.router.navigate(['/info-product']);
    });
  }
  EXeditProducto() {
    if (this.id !== null) {
      this.titleChange = 'Editar Producto';
      this._productService.getProducto(this.id).subscribe((data) => {
        console.log(data);
        this.createProduct.setValue({
          nombre: data.payload.data()['nombre'],
          descripcion: data.payload.data()['descripcion'],
          precioCompra: data.payload.data()['precioCompra'],
          precio: data.payload.data()['precio'],
          imagenes: data.payload.data()['imagenes'],
          disponible: data.payload.data()['disponible'],
        });
      });
    }
  }
}
