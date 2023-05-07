import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  modal = false;
  today = new Date();
  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.today = new Date(); // actualiza la fecha actual cada segundo
    }, 1000);
  }
  abrir() {
    this.modal = true;
  }
  cerrar() {
    this.modal = false;
  }
}
