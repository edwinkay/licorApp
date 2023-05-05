import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { InfoProductComponent } from './components/info-product/info-product.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-products', pathMatch: 'full' },
  { path: 'list-products', component: ListProductsComponent },
  { path: 'create-product', component: CreateProductComponent },
  { path: 'edit-product/:id', component: CreateProductComponent },
  { path: 'info-product', component: InfoProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
