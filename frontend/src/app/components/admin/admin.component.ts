import { Component, Inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

import { ButtonModule } from 'primeng/button';


import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

interface User{
  _id:string;
  username :string;
  firstname:string;
  role:string;
  email:string;
  surname:string;  
}


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MenubarModule,ButtonModule, RippleModule, ToastModule, TableModule ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})



export class AdminComponent {

  items: MenuItem[] | undefined;
  
  users!:User[]

  user!:User

  ngOnInit() {
      this.items = [
          {
              label: 'Customers',
              icon: 'pi pi-user',
              routerLink: ['/Admin']
          },
          {
              label: 'Books',
              icon: 'pi pi-book',
              routerLink:["/Admin/Books"]
          },
          {
              label: 'Orders',
              icon: 'pi pi-list-check',
              routerLink:["/Admin/Orders"]
          },
          {
            label:"Signout",
            icon:'pi pi-sign-out',
            command:()=>this.signout()
          }

      ]
    
      this.getUsers()
      
  }

  signout(){
    var url  = "http://localhost:5000/users/signout";

    fetch(url ,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      credentials:'include'
    })
    .then((response)=>{
      return response.json()
    })
    .then((data)=>{
      window.location.href = data.url
    })

  }

  getUsers(){
    var url = "http://localhost:5000/users/get-all-users"
    
    var token =  localStorage.getItem("token")

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
          'Authorization':"Bearer "+token
      },
      credentials:'include'
      })
      .then((response)=>{
        return response.json()
      })
      .then((data)=>{

        console.log(data)

        this.users = data
        
        
      })





  }

  delete_user(user:User){
      var url  =  "http://localhost:5000/users/delete-user/"+user._id
      
      var token  =  localStorage.getItem("token")

      const responseLabel =  (<HTMLInputElement>document.getElementById("Response"))
      const messageBox =  (<HTMLInputElement>document.getElementById("message"))

      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer '+token
        },
        credentials:'include'
        })
        .then((response)=>{
          return response.json()
        })
        .then((data)=>{
          
          console.log(data)

          if (data.message =="User Deleted") {
            window.location.href = "/Admin"
          }
          else{
            const message = data.message;
            messageBox.style.display = "block";
            responseLabel.style.color = "#aa0436";
            responseLabel.innerHTML =
              '<i class="pi pi-times"></i> ' + message;
          }

          
          
        })


  }



}
