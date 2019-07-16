
> More information about the architecture of the API can be found in this Medium story :
> https://medium.com/@phcollignon/node-rest-api-jwt-in-typescript-e6a8ae5cd8f8

# Node Rest API + JWT in TypeScript

- This is a simple **Node Rest Api** written in **Typescript**.  
- Routes can be protected with **JWT tokens**.
- Authentification with Passport. 

# How it works

- The API dispatches requests with well structured **routes**.
- Routes are using **controllers** for API implementations.
- Controllers are using **models** for Mongo persistence.
- Routes can be protected with **JWT authentification middelwares** :
```typescript
import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { AuthController } from "../controllers/authController";


export class ProductRoutes {

    public router: Router;
    public productController: ProductController = new ProductController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get("/", this.productController.getProducts);
        this.router.get("/:id", this.productController.getProduct);
        // The following routes are protected
        this.router.post("/", this.authController.authenticateJWT, this.productController.createProduct);
        this.router.put("/:id", this.authController.authenticateJWT, this.productController.updateProduct);
        this.router.delete("/:id", this.authController.authenticateJWT, this.productController.deleteProduct);
    }
}
```

# Installation
- Clone the repository
```
git clone https://github.com/Philippe-Collignon/rest-api-node-jwt-typescript.git
```
- Install dependencies
```
cd rest-api-node-jwt-typescript
npm install
npm run build
```
- Launch demo Node and Mongo server in docker containers
```
docker-compose build
docker-compose up
```
( *Alternatively, you can run and configure your local or cloud Mongo server and start Node server with
`npm run build && npm start`*)

Please check package.json for other useful npm scripts  (for example typescript and nodemon watchers in development)


# Getting started


## Step1 : Register a user
Send a POST request to `http://localhost:3000/api/user/register` 
with the following payload ** :
```json
{
	"username": "me",
	"password": "pass"
}
```
You should get a JWT token in the response :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lMiIsImlhdCI6MTU1MDU4MTA4NH0.WN5D-BFLypnuklvO3VFQ5ucDjBT68R2Yc-gj8AlkRAs"
}
```

> **Note  - Please protect your registration API if you do not use any third-party identity provider !!.

## Step2 : Create a Product
Send a POST request to `http://localhost:3000/api/products` 
with the following payload :
```json
{
  "productId": "13",
  "name": "Orange",
  "price": 5,
  "quantity": 6
}
``` 
You should get an authorization **denied** !
```json
{
  "status": "error",
  "code": "unauthorized"
}
```
Add the JWT token to the Authorization header :
```http
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lMiIsImlhdCI6MTU1MDU4MTA4NH0.WN5D-BFLypnuklvO3VFQ5ucDjBT68R2Yc-gj8AlkRAs
```
You should have created the product !!
```json
{
  "data": {
    "_id": "5c6c0845e3eb8302ffd168c0",
    "productId": "13",
    "name": "Orange",
    "price": 5,
    "quantity": 6,
    "__v": 0
  }
}
```
## Step2 : Get a Product
You can get the product with or without token because the Get route of Product router is not protected with the JWT authentification middelware.
Send a GET request to `http://localhost:3000/api/products/13`

You should get :
```json
[
  {
    "_id": "5c6bfc97e3eb8302ffd168be",
    "productId": "13",
    "name": "Orange",
    "price": 5,
    "quantity": 6,
    "__v": 0
  }
```

# Credits
Routing based on FazTech rest api 
