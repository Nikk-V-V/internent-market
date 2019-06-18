import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent} from './login/login.component'
import { AuthGuardService } from './auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { CartComponent } from './cart/cart.component'; 
import { AddressComponent } from './address/address.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home' , component: HomeComponent},
  { path: 'register', component: RegistrationComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService]}, 
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'profile/settings', component: SettingsComponent, canActivate: [AuthGuardService]},
  { path: 'categories', component: CategoriesComponent},
  { path: 'profile/product', component: ProductsComponent, canActivate: [AuthGuardService]},
  { path: 'profile/myproducts', component: MyProductsComponent, canActivate: [AuthGuardService]},
  { path: 'profile/address', component: AddressComponent, canActivate: [AuthGuardService]},
  { path: 'categories/:id', component: CategoryComponent },
  { path: 'product/:id', component: ProductComponent},
  { path: 'search', component: SearchComponent},
  { path: 'cart', component: CartComponent},
  { path: 'adminRoom', component: AdminComponent },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
