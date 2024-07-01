import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-books',
  standalone: true,
  imports: [MenubarModule,CardModule,ButtonModule],
  templateUrl: './admin-books.component.html',
  styleUrl: './admin-books.component.css'
})
export class AdminBooksComponent {


  items: MenuItem[] | undefined;




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
    
      this.getBooks()
      
  }

  getBooks(){
      var url  = "http://localhost:5000/books/get-books"

      var book_grid =  (<HTMLDivElement>document.getElementById("book-grid"))

      fetch(url ,{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:'include'
      })
      .then((response)=>{
        return response.json()
      })
      .then((data)=>{
          console.log(data)
          for(var  i =  0 ;i<data.length ;i++){
            book_grid.innerHTML=book_grid+ `

                  <p-card header="${data[i].title}" subheader="Author:${data[i].title}" [style]="{ width: '350px' }">
        <ng-template pTemplate="header">
            <img style="width: 350px; height: 186.09;" alt="Card" src="https://primefaces.org/cdn/primeng/images/card-ng.jpg" />
        </ng-template>
        <p style="font-size: 20px; text-align: end;">
            ${data[i].price}
        </p>
        <ng-template pTemplate="footer">
            <div class="flex gap-3 mt-1">
                <p-button id="${data[i]._id}" label="Edit" severity="secondary" class="w-full" styleClass="w-full" />
                
            </div>
        </ng-template>
    </p-card>
            
            `
          }

      })

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

}
