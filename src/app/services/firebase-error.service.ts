import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class FirebaseErrorService {
  constructor(private toastr: ToastrService) {}

  errorFirebase(code: string) {
    switch (code) {
      //login
      case 'auth/user-not-found':
        this.toastr.error('Usuario/Contraseña invalida', 'Error');
        break;
      case 'auth/wrong-password':
        this.toastr.error('Usuario/Contraseña invalida', 'Error');
        break;
      case 'auth/invalid-email':
        this.toastr.error(
          'No hay correo valido o llena todos los campos',
          'Error'
        );
        break;

      //registarse
      case 'auth/email-already-in-use':
        this.toastr.error('Usuario ya registrado', 'Error');
        break;
      case 'auth/weak-password':
        this.toastr.error('Contraseña Debil', 'Error');
        break;
      case 'auth/internal-error':
        this.toastr.error('Correo no valido', 'Error');
        break;

      default:
        'error desconocido';
        break;
    }
  }
}
