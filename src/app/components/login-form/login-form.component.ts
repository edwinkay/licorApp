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

  constructor(
    private firebaseError: FirebaseErrorService,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });}

  ngOnInit(): void {}

  login() {
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;


    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.router.navigate(['/list-products']);
        console.log(user);
      })
      .catch((error) => {
        this.firebaseError.errorFirebase(error.code);
        // console.log(error)
      });
  }
}
