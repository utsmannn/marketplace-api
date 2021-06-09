# Marketplace minimal API

## Base url

```
https://marketplace-min-api.herokuapp.com/v1
```

## Customer
### Register
```
POST /customer/user/register
```
Register new customer

#### Example

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
---

### Login
```
POST /customer/user/login
```
Login account

#### Example

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

---

