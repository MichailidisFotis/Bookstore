import { Component, Inject } from '@angular/core';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import {StyleClassModule} from 'primeng/styleclass';
import { DOCUMENT } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [StyleClassModule,CheckboxModule,MenubarModule,CardModule, ButtonModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {



  items: MenuItem[] | undefined;
  
  ngOnInit() {
      this.items = [
          {
              label: 'Login',
              icon: 'pi pi-sign-in',
              routerLink: ['/']
          },
          {
              label: 'Sign Up',
              icon: 'pi pi-user-plus',
              routerLink:["/signup"]
          }

      ]
  }

  login() {

    var username =  (<HTMLInputElement>document.getElementById("username")).value
    var password  =(<HTMLInputElement>document.getElementById("password")).value

    var url = "http://localhost:5000/users/login"
    
    var data =  {
      username:username,
      password:password
    }
    
    const responseLabel =  (<HTMLInputElement>document.getElementById("Response"))
    const messageBox =  (<HTMLInputElement>document.getElementById("message"))
  
    fetch(url, {
      method: "POST",
      credentials:'include',
      
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response)=>{
        return response.json()
      })
      .then((data)=>{
        


        if (!data.login) {
          const message = data.message;
          messageBox.style.display = "block";
          responseLabel.style.color = "#aa0436";
          responseLabel.innerHTML =
            '<i class="pi pi-times"></i> ' + message;
        }
        else{

          window.location.href=data.url
        }
          
        
        
      })

  }




}
