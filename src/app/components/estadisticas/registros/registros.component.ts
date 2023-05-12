import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegistrosService } from 'src/app/services/registros.service';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss'],
})
export class RegistrosComponent implements OnInit {
  registros: any[] = [];
  nombre: any = []
  cantidades: any = []
  ganancia: any
  total: any

  constructor(
    private _registro: RegistrosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtregistros()
  }
  obtregistros(){
    this._registro.obtRegistros().subscribe(data => {
      data.forEach((element: any) => {
        this.registros.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
        console.log(this.registros)
      });
      const nombres = this.registros.map(r=> r.nombres)
      this.nombre = nombres
      const cantidades = this.registros.map(r=> r.cantidades)
      this.cantidades = cantidades
      const ganancia = this.registros.map(r=> r.gananciaObtenida)
      this.ganancia = ganancia
      const total = this.registros.map(r=> r.total)
      this.total = total
    })
  }
}
