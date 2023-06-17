import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { RegistrosService } from 'src/app/services/registros.service';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  reportes: any[] = [];
  reports: any[] = [];
  totalVentas: number = 0;
  gananciaObtenida: number = 0;
  modalActivoEliminar = false;
  idObtenido: any;

  constructor(
    private _products: ProductsService,
    private _reportes: ReportesService,
    private _registro: RegistrosService,
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

      for(const item of this.reportes) {
        const ganancia = item.ganancia
        item.gananciaObtenida = parseInt(ganancia);
      }
      //obteniendo la ganancia
      let ganancias = this.reportes.reduce(
        (accumulator, currentValue) => accumulator + currentValue.gananciaObtenida ,
        0
      );
      this.gananciaObtenida = ganancias;
      console.log('mostrar', ganancias)

      //obt compratotal
      // const lista = this.reportes.map((item) => item.precioTotalCompra);

      // const totalCompra = lista
      //   .reduce((acc, curr) => acc.concat(curr), []) // Aplanar la matriz
      //   .reduce((acc: any, curr: any) => acc + curr, 0); // Sumar los elementos
      // this.gananciaObtenida = total - totalCompra; //

      for (const item of this.reportes) {
        const timestamp = item.fechaCreacion;

        if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
          const milliseconds =
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
          const date = new Date(milliseconds);
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Bogota',
            dateStyle: 'medium',
            timeStyle: 'medium',
          }).format(date);

          item.fechaCreacion = formattedDate;
        }
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
  abrirModalEliminar() {
    this.modalActivoEliminar = true;
  }
  cerrarModalEliminar() {
    this.modalActivoEliminar = false;
  }
  eliminarReportes() {
    const nombres = this.reportes.map((r) => r.nombre)
    const cantidad = this.reportes.map((r) => r.cantidad)
    const gananciaObtenida = this.gananciaObtenida
    const total = this.totalVentas
    const nombre = nombres.flat()
    const cantidades = cantidad.flat()
    console.log(nombre)
    const pay = {
      nombres: nombre,
      cantidades: cantidades,
      gananciaObtenida: gananciaObtenida,
      total: total
    }
    console.log(pay)
    this._registro.addRegistros(pay).then(() => {
    })
    this.modalActivoEliminar = false;
      this._reportes.deleteAllReports().then(() => {
       this.reportes = [];
       this.gananciaObtenida = 0
       this.totalVentas = 0
        this.toastr.info('Registrado con exito', 'Reporte Registrados!!');
      })
  }
}
