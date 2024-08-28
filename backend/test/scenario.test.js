import app from "../index.js"
import request from "supertest";
import requireLogin from '../middlewares/requireLogin.js'



var loginResponse;


const user_customer ={
    username:"test_customer",
    password:"1234",
    verify_password:"1234",
    firstname:"test_customer_firstname",
    surname:"test_customer_surname",
    email:"test@customer.gr",
    role:"Customer"
}


const user_admin = {
    username:"test_admin",
    password:"1234",
    verify_password:"1234",
    firstname:"test_admin_firstname",
    surname:"test_admin_surname",
    email:"test@admin.gr",
    role:"Admin"
}

const login_admin ={
    username:"test_admin",
    password:"1234"
}


const login_customer ={
    username:"test_customer",
    password:"1234"
}


const book_1 = {
    title:"test_book_1",
    price:1.0,
    author:"test_author_1",

}


const book_2 = {
    title:"test_book_2",
    price:1.0,
    author:"test_author_2",

}

var book_1_id
var book_2_id

var admin_id
var customer_id

var token

test("Register admin is done correctly",async()=>{
    var response =  await request(app)
    .post("/users/signup")
    .send(user_admin)

    admin_id =  response.body.user_id

      expect(response.body.message).toBe("Signup Successful, you received an email!!!")
      expect(response.body.signup).toBe(true)
      expect(response.status).toBe(201)
})

test("Register customer is done correctly",async()=>{
    var response =  await request(app)
    .post("/users/signup")
    .send(user_customer)

    customer_id =  response.body.user_id
  
      expect(response.body.message).toBe("Signup Successful, you received an email!!!")
      expect(response.body.signup).toBe(true)
      expect(response.status).toBe(201)
})

test("Login as admin is done correctly" , async()=>{
    loginResponse  = await request(app)
    .post("/users/login")
    .send(login_admin)

    token =  loginResponse.body.token

    expect(loginResponse.body.message).toBe("Logged in as admin")
    expect(loginResponse.status).toBe(200)

})


test("Create a new Books is done correctly" , async()=>{
    var response =  await request(app)
    .post("/books/add-book")
    .send(book_1)
    .set("Cookie" , loginResponse.header['set-cookie'])
    .set('Authorization' , 'Bearer '+token)

    book_1_id =response.body.book_id
    

    var response_2 =  await request(app)
    .post("/books/add-book")
    .send(book_2)
    .set("Cookie" , loginResponse.header['set-cookie'])
    .set('Authorization' , 'Bearer '+token)

    book_2_id =response_2.body.book_id

    expect(response.body.message).toBe("New Book added")
    expect(response.status).toBe(201)



    expect(response_2.body.message).toBe("New Book added")
    expect(response_2.status).toBe(201)
})




test("Changing books price is done correctly" , async()=>{
    var response  =  await request(app)
    .patch("/books/update-book/"+book_1_id)
    .send({
        price:30.45
    })
    .set("Cookie" , loginResponse.header['set-cookie'])
    .set('Authorization' , 'Bearer '+token)


    expect(response.body.message).toBe("Book price updated")
    expect(response.status).toBe(200)


})

test("Deleting books is done correctly" , async()=>{

    var response  = await request(app)
    .delete("/books/delete-book/"+book_1_id)
    .set('Cookie' , loginResponse.header['set-cookie'])
    .set('Authorization' , 'Bearer '+token)
    
    
    var response_2 =  await request(app)
    .delete("/books/delete-book/"+book_2_id)
    .set('Cookie' ,loginResponse.header['set-cookie'])
    .set('Authorization' , 'Bearer '+token)
    
    expect(response.body.message).toBe(`Book : ${book_1.title} deleted`)
    expect(response.status).toBe(200)

    expect(response_2.body.message).toBe(`Book : ${book_2.title} deleted`)
    expect(response_2.status).toBe(200)
})

test("Deleting users is done correctly" , async()=>{

    var response  = await request(app)
    .delete("/users/delete-user/"+admin_id)
    .set('Cookie' , loginResponse.header['set-cookie'])
    .set('Authorization' , 'Bearer '+token)
    
    
    var response_2 =  await request(app)
    .delete("/users/delete-user/"+customer_id)
    .set('Cookie' ,loginResponse.header['set-cookie'])
    .set('Authorization' , 'Bearer '+token)

    
    expect(response.body.message).toBe('User Deleted')
    expect(response.status).toBe(200)

    expect(response_2.body.message).toBe('User Deleted')
    expect(response_2.status).toBe(200)


})



test("Singout Admin is done correctly" , async()=>{

    var response =  await request(app)
    .post("/users/signout")
    .set('Cookie' , loginResponse.header['set-cookie'])
    .set('Authorization' , 'Bearer '+token)


    expect(response.body.message).toBe("Signout!!!")
    expect(response.status).toBe(200)


})

test("Create a new Books is not completed when admin is not logged in" , async()=>{
    var response =  await request(app)
    .post("/books/add-book")
    .send(book_1)
    .set("Cookie" , loginResponse.header['set-cookie'])
    .set('Authorization' , 'Bearer '+token)

    book_1_id =response.body.book_id
    
    expect(response.body.message).toBe("Unauthorized")
    expect(response.status).toBe(401)


})


