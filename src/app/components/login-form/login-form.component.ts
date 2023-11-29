import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  loginUsuario: FormGroup;
  loading: boolean = false;
  verificar: boolean = false;
  message: string =
    '';

  constructor(
    private firebaseError: FirebaseErrorService,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loginUsuario.patchValue({
      email: 'administrador.sistema@gmail.com',
      password: '123400',
    });
  }

  login() {
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;

    if (
      email === 'administrador.sistema@gmail.com' ||
      email === 'dlaleja10@hotmail.com' ||
      email === 'brahianriver99@gmail.com' ||
      email === 'edwinkaycut@gmail.com'
    ) {
      this.loading = true;
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          this.router.navigate(['/list-products']);
          console.log(user);
        })
        .catch((error) => {
          this.firebaseError.errorFirebase(error.code);
          this.loading = false;
          // console.log(error)
        });
    } else {
      this.verificar = true;
      this.message =
        'No estas Autorizado, comunicate con el administrador del sistema,';
      setTimeout(() => {
        this.message = '';
      }, 2000);
    }
  }
}
