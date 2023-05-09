import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  modal = false;
  today = new Date();
  dataUser: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.today = new Date(); // actualiza la fecha actual cada segundo
    }, 1000);

    this.afAuth.currentUser.then((data) => {
      if (data) {
        console.log('Correo:', data.email);
        switch (data.email) {
          case 'dlaleja10@hotmail.com':
            this.dataUser = 'Alejandra';
            break;
          case 'administrador.sistema@gmail.com':
            this.dataUser = 'Administrador';
            break;
          case 'brahianriver99@gmail.com':
            this.dataUser = 'Brahian';
            break;
          case 'edwinkaycut@gmail.com':
            this.dataUser = 'EdwinK';
            break;

          default:
            break;
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
  abrir() {
    this.modal = true;
  }
  cerrar() {
    this.modal = false;
  }
}
