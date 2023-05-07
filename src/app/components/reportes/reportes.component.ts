import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  reportes: any[] = [];

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
      console.log(this.reportes);
    })
  }

}
