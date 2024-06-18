import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminComponent } from './components/admin/admin.component';
import { CustomerComponent } from './components/customer/customer.component';
import { AdminBooksComponent } from './components/admin-books/admin-books.component';



export const routes: Routes = [{
    path:"",
    component:LoginComponent
},
{
    path:"signup",
    component:SignupComponent
},
{
    path:"Admin",
    component:AdminComponent
},
{
    path:"Customer",
    component:CustomerComponent
},
{
   path:"Admin/Books",
   component:AdminBooksComponent

}

];
