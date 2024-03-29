import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


//firebase and enviroments
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

// modulos
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { InfoProductComponent } from './components/info-product/info-product.component';
import { ToastrModule } from 'ngx-toastr';
import { ReportesComponent } from './components/reportes/reportes.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { GananciaComponent } from './components/estadisticas/ganancia/ganancia.component';
import { RptProductComponent } from './components/estadisticas/rpt-product/rpt-product.component';
import { RegistrosComponent } from './components/estadisticas/registros/registros.component';

registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    ListProductsComponent,
    NavbarComponent,
    CreateProductComponent,
    InfoProductComponent,
    ReportesComponent,
    LoginFormComponent,
    RegistrarUsuarioComponent,
    RecuperarContrasenaComponent,
    SpinnerComponent,
    GananciaComponent,
    RptProductComponent,
    RegistrosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent],
  exports: [MatToolbarModule],
})
export class AppModule {}
