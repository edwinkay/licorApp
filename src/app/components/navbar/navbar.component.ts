import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

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

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {
    setInterval(() => {
      this.today = new Date(); // actualiza la fecha actual cada segundo
    }, 1000);

     this.afAuth.currentUser.then((data) => {
       if (data) {
        console.log('Correo:', data.email);
         this.dataUser = data;
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
