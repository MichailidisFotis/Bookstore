import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import {StyleClassModule} from 'primeng/styleclass';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { NgModel } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';




@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MenubarModule,MessagesModule,DropdownModule,CardModule,CheckboxModule , StyleClassModule ,ButtonModule,InputTextModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})



export class SignupComponent {
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

      ];

  }

  signup(){


    var username =  (<HTMLInputElement>document.getElementById("username")).value
    var password  =(<HTMLInputElement>document.getElementById("password")).value
    var firstname = (<HTMLInputElement>document.getElementById("firstname")).value
    var surname = (<HTMLInputElement>document.getElementById("surname")).value
    var email = (<HTMLInputElement>document.getElementById("email")).value
    var role =  (<HTMLInputElement>document.getElementById("role")).value
    var verify_password = (<HTMLInputElement>document.getElementById("verify-password")).value

    const responseLabel =  (<HTMLInputElement>document.getElementById("Response"))
    const messageBox =  (<HTMLInputElement>document.getElementById("message"))



    var url = "http://localhost:5000/users/signup"
    
    var data =  {
      username:username,
      password:password,
      verify_password:verify_password,
      role:role,
      email:email,
      firstname:firstname,
      surname:surname
    }
    
  
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
      })
      .then((response)=>{
        return response.json()
      })
      .then((data)=>{

        if (!data.signup) {
          const message = data.message;
          messageBox.style.display = "block";
          responseLabel.style.color = "#aa0436";
          responseLabel.innerHTML =
            '<i class="pi pi-times"></i> ' + message;
        } 
        else {
          const message = data.message;
          messageBox.style.display = "block";
          responseLabel.style.color = "#04aa6d"
          responseLabel.innerHTML='<i class="pi pi-check"></i> '+message
        }

      })





  }
}
