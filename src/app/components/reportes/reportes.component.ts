import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  reportes: any[] = [];
  reports: any[] = [];

  constructor(private _reportes: ReportesService) { }

  ngOnInit(): void {
    this.obtReportes()
  }
  obtReportes(){
    this._reportes.obtReports().subscribe(data => {
      data.forEach((element: any) => {
        this.reportes.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      })
            for (const item of this.reportes) {
              const timestamp = item.fechaCreacion;
              const milliseconds =
                timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
                const date = new Date(milliseconds);
                const formattedDate = date.toLocaleString();
               item.fechaCreacion = formattedDate;
            }
    })
  }

}
