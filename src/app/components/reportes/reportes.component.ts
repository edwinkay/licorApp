import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  reportes: any[] = [];
  products: any[] = [];
  reports: any[] = [];
  totalVentas: number = 0;
  gananciaObtenida: number = 0;
  modalActivoEliminar = false;
  idObtenido: any;

  constructor(
    private _products: ProductsService,
    private _reportes: ReportesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtReportes();
  }
  obtReportes() {
    this._reportes.obtReports().subscribe((data) => {
      data.forEach((element: any) => {
        this.reportes.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      //obteniendo el total
      let total = this.reportes.reduce(
        (accumulator, currentValue) => accumulator + currentValue.total,
        0
      );
      this.totalVentas = total;
      //obt compratotal
      const lista = this.reportes.map((item) => item.precioCompra);

      const totalCompra = lista
        .reduce((acc, curr) => acc.concat(curr), []) // Aplanar la matriz
        .reduce((acc: any, curr: any) => acc + curr, 0); // Sumar los elementos
      this.gananciaObtenida = total - totalCompra; //

      for (const item of this.reportes) {
        const timestamp = item.fechaCreacion;
        const milliseconds =
          timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
        const date = new Date(milliseconds);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
          timeZone: 'UTC',
          dateStyle: 'medium',
          timeStyle: 'medium',
        }).format(date);
        item.fechaCreacion = formattedDate;
      }
    });
  }
  joinArray(arr: string[], separator: string): string {
    return arr.join(separator);
  }
  countOccurrences(arr: string[]): string[] {
    const result = [];
    const count: Record<string, number> = {};
    for (const item of arr) {
      if (item in count) {
        count[item] += 1;
      } else {
        count[item] = 1;
      }
    }
    for (const [item, occ] of Object.entries(count)) {
      result.push(`${item}${occ > 1 ? ' x' + occ : ''}`);
    }
    return result;
  }
  abrirModalEliminar(id: string) {
    this.idObtenido = id;
    this.modalActivoEliminar = true;
  }
  cerrarModalEliminar() {
    this.modalActivoEliminar = false;
  }
  eliminarProducto2() {
    this._reportes.deleteProducts(this.idObtenido).then(() => {
      this.modalActivoEliminar = false;
      this.toastr.error(
        'El producto fue eliminado con exito',
        'Producto eliminado'
      );
      window.location.reload();
    });
  }
}
