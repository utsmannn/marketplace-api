# Marketplace minimal API

## Base url

```
https://marketplace-min-api.herokuapp.com/v1
```

## Customer

| Name                | Endpoint                                                    | Method | Bearer token | Body and response                          |
| ------------------- | ----------------------------------------------------------- | ------ | ------------ | ------------------------------------------ |
| Register            | `/customer/user/register`                                   | `POST` | no           | [example](#customer---register)            |
| Login               | `/customer/user/login`                                      | `POST` | no           | [example](#customer---login)               |
| Get customer info   | `/customer/user`                                            | `GET`  | yes          | [example](#customer---get-user-info)       |
| Get products        | `/customer/products`                                        | `GET`  | no           | [example](#customer---get-products)        |
| Get product by Id   | `/customer/product?productId={product-id}`                  | `GET`  | no           | [example](#customer---get-product-by-id)   |
| Get cart            | `/customer/cart`                                            | `GET`  | yes          | [example](#customer---get-cart)            |
| Add product to cart | `/customer/cart?productId={product-id}&quantity={quantity}` | `POST` | yes          | [example](#customer---add-product-to-cart) |

## Examples

### Customer - Register

Body

```
{
	"username": "niar",
	"password": "1234"
}
```

Response

```
{
  "success": true,
  "message": "Add user success!",
  "data": {
    "expiredAt": 1622885455368,
    "updatedAt": 1622885435453,
    "role": "customer",
    "username": "user-1",
    "id": "1dcdcf58-99a5-4965-8b46-10a2429726b0",
    "password": "$2b$10$w/jwx5LVgFPpvUOqE/v15e184Qp1DANfX.Y01qL1Mrb9owg5.3wuG"
  }
}
```

### Customer - Login

Body

```
{
	"username": "user-1",
	"password": "1234"
}
```

Response

```
{
  "success": true,
  "message": "Login success!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjE2MjI4ODU3MzIsImlkIjoiNTY0NGE5YmYtYThkZS00N2FkLTg1MTMtZmNkZTgyYTQ4ZGYyIiwicGFzc3dvcmQiOiIkMmIkMTAkdy9qd3g1TFZnRlBwdlVPcUUvdjE1ZTE4NFFwMURBTmZYLlkwMXFMMU1yYjlvd2c1LjN3dUciLCJyb2xlIjoiY3VzdG9tZXIiLCJ1cGRhdGVkQXQiOjE2MjI3OTUwMzkxOTUsInVzZXJuYW1lIjoibmlhciIsImlhdCI6MTYyMjg4NDc4OCwiZXhwIjoxNjIyODg2NTg4fQ.38GxoDpPxLxwuDA9yrlqkwyqucXgcHi7mBXixGlKOmU"
  }
}
```

### Customer - Get User info

Response

```
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

Response

```
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

Response

```
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

### Customer - Getting cart

Response

```
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

### Customer - Add products to cart

Response

```
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

---
