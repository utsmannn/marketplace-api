# Marketplace Minimal API

## Base url

```
https://marketplace-min-api.herokuapp.com/v1
```

## Table endpoints
### Customer

| Name                       | Endpoint                                                    | Method   | Bearer token | Body and response                                  |
| -------------------------- | ----------------------------------------------------------- | -------- | ------------ | -------------------------------------------------- |
| Register                   | `/customer/user/register`                                   | `POST`   | no           | [example](#customer---register)                    |
| Login                      | `/customer/user/login`                                      | `POST`   | no           | [example](#customer---login)                       |
| Get customer info          | `/customer/user`                                            | `GET`    | yes          | [example](#customer---get-user-info)               |
| Get products               | `/customer/products`                                        | `GET`    | no           | [example](#customer---get-products)                |
| Get product by Id          | `/customer/product?productId={product-id}`                  | `GET`    | no           | [example](#customer---get-product-by-id)           |
| Get cart                   | `/customer/cart`                                            | `GET`    | yes          | [example](#customer---get-cart)                    |
| Add product to cart        | `/customer/cart?productId={product-id}&quantity={quantity}` | `POST`   | yes          | [example](#customer---add-product-to-cart)         |
| Delete product in cart     | `/customer/cart?productId={product-id}&quantity={quantity}` | `DELETE` | yes          | [example](#customer---delete-product-in-cart)      |
| Add product to cart (bulk) | `/customer/cart/bulk`                                       | `POST`   | yes          | [example](#customer---add-product-to-cart-by-bulk) |

### Seller

| Name              | Endpoint                                 | Method   | Bearer token | Body and response                      |
| ----------------- | ---------------------------------------- | -------- | ------------ | -------------------------------------- |
| Register          | `/seller/user/register`                  | `POST`   | no           | [example](#seller---register)          |
| Login             | `/seller/user/login`                     | `POST`   | no           | [example](#seller---login)             |
| Get customer info | `/seller/user`                           | `GET`    | yes          | [example](#seller---get-user-info)     |
| Get products      | `/seller/products`                       | `GET`    | yes          | [example](#seller---get-products)      |
| Get product by Id | `/seller/product?productId={product-id}` | `GET`    | yes          | [example](#seller---get-product-by-id) |
| Add product       | `/seller/product`                        | `POST`   | yes          | [example](#seller---add-product)       |
| Edit product      | `/seller/product?productId={product-id}` | `PATCH`  | yes          | [example](#seller---edit-product)      |
| Delete product    | `/seller/product?productId={product-id}` | `DELETE` | yes          | [example](#seller---delete-product)    |

## Run on localhost
- Setup your firebase
- Setup environment from `.env.temp`
- Run `npm install`
- Run `npm run dev`

## Insomnia collection
Import file `insomnia-marketplace-collection.json` to your Insomnia (I hate postman wkwk), and setup  your environment collection.

---

## Customer Examples
### Customer - Register

```
POST /customer/user/register
```

Body

```json
{
  "username": "niar",
  "password": "1234"
}
```

Response

```json
{
  "success": true,
  "message": "Add user success!",
  "data": {
    "expiredAt": 1622885455368,
    "updatedAt": 1622885435453,
    "role": "customer",
    "username": "niar",
    "id": "1dcdcf58-99a5-4965-8b46-10a2429726b0",
    "password": "$2b$10$w/jwx5LVgFPpvUOqE/v15e184Qp1DANfX.Y01qL1Mrb9owg5.3wuG"
  }
}
```

### Customer - Login

```
POST /customer/user/login
```

Body

```json
{
  "username": "niar",
  "password": "1234"
}
```

Response

```json
{
  "success": true,
  "message": "Login success!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI4ODU3MzIsImlkIjoiNTY0NGE5YmYtYThkZS00N2FkLTg1MTMtZmNkZTgyYTQ4ZGYyIiwicGFzc3dvcmQiOiIkMmIkMTAkdy9qd3g1TFZnRlBwdlVPcUUvdjE1ZTE4NFFwMURBTmZYLlkwMXFMMU1yYjlvd2c1LjN3dUciLCJyb2xlIjoiY3VzdG9tZXIiLCJ1cGRhdGVkQXQiOjE2MjI3OTUwMzkxOTUsInVzZXJuYW1lIjoibmlhciIsImlhdCI6MTYyMjg4NDc4OCwiZXhwIjoxNjIyODg2NTg4fQ.38GxoDpPxLxwuDA9yrlqkwyqucXgcHi7mBXixGlKOmU"
  }
}
```

### Customer - Get User info

```
GET /customer/user
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Response

```json
{
  "success": true,
  "message": "Get user success!",
  "data": {
    "expiredAt": 1623265384,
    "id": "5644a9bf-a8de-47ad-8513-fcde82a48df2",
    "password": "$2b$10$w/jwx5LVgFPpvUOqE/v15e184Qp1DANfX.Y01qL1Mrb9owg5.3wuG",
    "role": "customer",
    "updatedAt": 1622795039195,
    "username": "niar"
  }
}
```

### Customer - Get products

```
GET /customer/products
```

Response

```json
{
  "success": true,
  "message": "Get product success!",
  "data": {
    "products": [
      {
        "id": "28cb9ab7-442c-4614-bd26-d68b471e3b76",
        "name": "kucing",
        "price": 102,
        "quantity": 10,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794970387
      },
      {
        "id": "374b684c-2f9c-4aeb-8343-d709120ecb19",
        "name": "korek",
        "price": 23233,
        "quantity": 113,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794962693
      },
      {
        "id": "4367cc89-f2d1-4ae7-b499-603c4e5e7f28",
        "name": "kardus",
        "price": 32321,
        "quantity": 3,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794916821
      },
      {
        "id": "484ce23f-6a85-4e56-817a-f86b50f8b957",
        "name": "kopi",
        "price": 100,
        "quantity": 103,
        "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea",
        "updatedAt": 1622796352174
      },
      {
        "id": "4ad46125-a019-476a-9dff-075880768058",
        "name": "meja",
        "price": 323,
        "quantity": 12,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794949177
      },
      {
        "id": "78d243f6-92ac-4558-9375-20aa7d3411ac",
        "name": "marjan",
        "price": 3443,
        "quantity": 1000,
        "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea",
        "updatedAt": 1622796361390
      },
      {
        "id": "d0a0e586-59fe-489e-bcac-ed8bb9553c9f",
        "name": "kursi",
        "price": 200,
        "quantity": 103,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622796035659
      }
    ],
    "currentPage": 1,
    "nextPage": null,
    "maxPage": 1,
    "totalSize": 7,
    "pageSize": 10
  }
}
```

### Customer - Get product by Id

```
GET /customer/product?productId=374b684c-2f9c-4aeb-8343-d709120ecb19
```

Response

```json
{
  "success": true,
  "message": "Get product success!",
  "data": {
    "id": "78d243f6-92ac-4558-9375-20aa7d3411ac",
    "name": "marjan",
    "price": 3443,
    "quantity": 1000,
    "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea",
    "updatedAt": 1622796361390
  }
}
```

### Customer - Get cart

```
GET /customer/cart
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Response

```json
{
  "success": true,
  "message": "Get cart success!",
  "data": {
    "customerId": "5644a9bf-a8de-47ad-8513-fcde82a48df2",
    "id": "a8933f3a-4f6c-4c61-9651-deff8e377798",
    "items": [
      {
        "productId": "484ce23f-6a85-4e56-817a-f86b50f8b957",
        "quantity": 3,
        "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea"
      },
      {
        "productId": "4ad46125-a019-476a-9dff-075880768058",
        "quantity": 2,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c"
      }
    ],
    "updatedAt": 1622798930590
  }
}
```

### Customer - Add product to cart

```
POST /customer/cart?productId=374b684c-2f9c-4aeb-8343-d709120ecb19&quantity=2
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Response

```json
{
  "success": true,
  "message": "Add cart success!",
  "data": {
    "id": "94837927-4cb4-4c6a-89f5-2a58f7e006c2",
    "updatedAt": 1622798518435,
    "customerId": "5644a9bf-a8de-47ad-8513-fcde82a48df2",
    "items": [
      {
        "productId": "4367cc89-f2d1-4ae7-b499-603c4e5e7f28",
        "quantity": 1,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c"
      }
    ]
  }
}
```

### Customer - Delete product in cart

```
DELETE /customer/cart?productId=374b684c-2f9c-4aeb-8343-d709120ecb19&quantity=1
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Response

```json
{
  "success": true,
  "message": "Delete cart success!",
  "data": {
    "customerId": "5644a9bf-a8de-47ad-8513-fcde82a48df2",
    "id": "a8933f3a-4f6c-4c61-9651-deff8e377798",
    "items": [
      {
        "productId": "484ce23f-6a85-4e56-817a-f86b50f8b957",
        "quantity": 3,
        "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea"
      },
      {
        "productId": "4ad46125-a019-476a-9dff-075880768058",
        "quantity": 1,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c"
      }
    ],
    "updatedAt": 1623265072965
  }
}
```

### Customer - Add product to cart by bulk

```
POST /customer/cart/bulk
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Body

```json
[
  {
    "productId": "484ce23f-6a85-4e56-817a-f86b50f8b957",
    "quantity": 3
  },
  {
    "productId": "4ad46125-a019-476a-9dff-075880768058",
    "quantity": 2
  }
]
```

Response

```json
{
  "success": true,
  "message": "Add cart success!",
  "data": {
    "id": "a8933f3a-4f6c-4c61-9651-deff8e377798",
    "updatedAt": 1622798930590,
    "customerId": "5644a9bf-a8de-47ad-8513-fcde82a48df2",
    "items": [
      {
        "productId": "484ce23f-6a85-4e56-817a-f86b50f8b957",
        "quantity": 3,
        "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea"
      },
      {
        "productId": "4ad46125-a019-476a-9dff-075880768058",
        "quantity": 2,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c"
      }
    ]
  }
}
```

---

## Seller Examples

### Customer - Register

```
POST /seller/user/register
```

Body

```json
{
  "username": "khalan",
  "password": "1234"
}
```

Response

```json
{
  "success": true,
  "message": "Add user success!",
  "data": {
    "expiredAt": 1622885455368,
    "updatedAt": 1622885435453,
    "role": "customer",
    "username": "khalan",
    "id": "1dcdcf58-99a5-4965-8b46-10a2429726b0",
    "password": "$2b$10$w/jwx5LVgFPpvUOqE/v15e184Qp1DANfX.Y01qL1Mrb9owg5.3wuG"
  }
}
```

### Customer - Login

```
POST /seller/user/login
```

Body

```json
{
  "username": "khalan",
  "password": "1234"
}
```

Response

```json
{
  "success": true,
  "message": "Login success!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI4ODU3MzIsImlkIjoiNTY0NGE5YmYtYThkZS00N2FkLTg1MTMtZmNkZTgyYTQ4ZGYyIiwicGFzc3dvcmQiOiIkMmIkMTAkdy9qd3g1TFZnRlBwdlVPcUUvdjE1ZTE4NFFwMURBTmZYLlkwMXFMMU1yYjlvd2c1LjN3dUciLCJyb2xlIjoiY3VzdG9tZXIiLCJ1cGRhdGVkQXQiOjE2MjI3OTUwMzkxOTUsInVzZXJuYW1lIjoibmlhciIsImlhdCI6MTYyMjg4NDc4OCwiZXhwIjoxNjIyODg2NTg4fQ.38GxoDpPxLxwuDA9yrlqkwyqucXgcHi7mBXixGlKOmU"
  }
}
```

### Seller - Get User info

```
GET /seller/user
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Response

```json
{
  "success": true,
  "message": "Get user success!",
  "data": {
    "expiredAt": 1623265384,
    "id": "5644a9bf-a8de-47ad-8513-fcde82a48df2",
    "password": "$2b$10$w/jwx5LVgFPpvUOqE/v15e184Qp1DANfX.Y01qL1Mrb9owg5.3wuG",
    "role": "seller",
    "updatedAt": 1622795039195,
    "username": "khalan"
  }
}
```

### Seller - Get products

```
GET /seller/products
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Response

```json
{
  "success": true,
  "message": "Get product success!",
  "data": {
    "products": [
      {
        "id": "28cb9ab7-442c-4614-bd26-d68b471e3b76",
        "name": "kucing",
        "price": 102,
        "quantity": 10,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794970387
      },
      {
        "id": "374b684c-2f9c-4aeb-8343-d709120ecb19",
        "name": "korek",
        "price": 23233,
        "quantity": 113,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794962693
      },
      {
        "id": "4367cc89-f2d1-4ae7-b499-603c4e5e7f28",
        "name": "kardus",
        "price": 32321,
        "quantity": 3,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794916821
      },
      {
        "id": "484ce23f-6a85-4e56-817a-f86b50f8b957",
        "name": "kopi",
        "price": 100,
        "quantity": 103,
        "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea",
        "updatedAt": 1622796352174
      },
      {
        "id": "4ad46125-a019-476a-9dff-075880768058",
        "name": "meja",
        "price": 323,
        "quantity": 12,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794949177
      },
      {
        "id": "78d243f6-92ac-4558-9375-20aa7d3411ac",
        "name": "marjan",
        "price": 3443,
        "quantity": 1000,
        "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea",
        "updatedAt": 1622796361390
      },
      {
        "id": "d0a0e586-59fe-489e-bcac-ed8bb9553c9f",
        "name": "kursi",
        "price": 200,
        "quantity": 103,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622796035659
      }
    ],
    "currentPage": 1,
    "nextPage": null,
    "maxPage": 1,
    "totalSize": 7,
    "pageSize": 10
  }
}
```

### Seller - Get product by Id

```
GET /seller/product?productId=374b684c-2f9c-4aeb-8343-d709120ecb19
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Response

```json
{
  "success": true,
  "message": "Get product success!",
  "data": {
    "id": "78d243f6-92ac-4558-9375-20aa7d3411ac",
    "name": "marjan",
    "price": 3443,
    "quantity": 1000,
    "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea",
    "updatedAt": 1622796361390
  }
}
```

### Seller - Add product

```
POST /seller/product
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Body

```json
{
  "name": "marjan",
  "price": 3443,
  "quantity": 1000
}
```

Response

```json
{
  "success": true,
  "message": "Add product success!",
  "data": {
    "name": "marjan",
    "updatedAt": 1622796361390,
    "quantity": 1000,
    "price": 3443,
    "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea",
    "id": "78d243f6-92ac-4558-9375-20aa7d3411ac"
  }
}
```

### Seller - Edit product

```
PATCH /seller/product?productId=78d243f6-92ac-4558-9375-20aa7d3411ac
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Body

```json
{
  "quantity": 1002
}
```

Response

```json
{
  "success": true,
  "message": "Edit product success!",
  "data": {
    "name": "marjan",
    "updatedAt": 1622796361390,
    "quantity": 1002,
    "price": 3443,
    "sellerId": "fbe15aaf-9710-4128-92b4-057340bbc9ea",
    "id": "78d243f6-92ac-4558-9375-20aa7d3411ac"
  }
}
```

### Seller - Delete product

```
DELETE /seller/product?productId=78d243f6-92ac-4558-9375-20aa7d3411ac
HEADER Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI....
```

Response

```json
{
  "success": true,
  "message": "Delete product success!",
  "data": {
    "products": [
      {
        "id": "4367cc89-f2d1-4ae7-b499-603c4e5e7f28",
        "name": "kardus",
        "price": 32321,
        "quantity": 3,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794916821
      },
      {
        "id": "4ad46125-a019-476a-9dff-075880768058",
        "name": "meja",
        "price": 323,
        "quantity": 12,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794949177
      },
      {
        "id": "d0a0e586-59fe-489e-bcac-ed8bb9553c9f",
        "name": "kursi",
        "price": 200,
        "quantity": 103,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622796035659
      },
      {
        "id": "28cb9ab7-442c-4614-bd26-d68b471e3b76",
        "name": "kucing",
        "price": 102,
        "quantity": 10,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794970387
      },
      {
        "id": "374b684c-2f9c-4aeb-8343-d709120ecb19",
        "name": "korek",
        "price": 23233,
        "quantity": 113,
        "sellerId": "eabf973b-467d-4fb9-9278-2fd0bc54a63c",
        "updatedAt": 1622794962693
      }
    ],
    "currentPage": 1,
    "nextPage": null,
    "maxPage": 1,
    "totalSize": 5,
    "pageSize": 10
  }
}
```
