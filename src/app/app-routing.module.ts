import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { InfoProductComponent } from './components/info-product/info-product.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { AuthGuard } from './auth.guard';
import { GananciaComponent } from './components/estadisticas/ganancia/ganancia.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'list-products',
    component: ListProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-product',
    component: CreateProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-product/:id',
    component: CreateProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'info-product',
    component: InfoProductComponent,
    canActivate: [AuthGuard],
  },
  { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard] },
  { path: 'estadisticas', component: GananciaComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginFormComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent },
  { path: 'registrar', component: RegistrarUsuarioComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
