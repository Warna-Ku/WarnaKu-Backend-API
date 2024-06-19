# WarnaKu-Backend-API Capstone C241-PS452

## Cloud Computing Member

* **C214D4KY1014** - Wildan Syaifudin Ahmad – Universitas Islam Indonesia
* **C003D4KY1285** - Kenneth Julian Perry – Institut Teknologi Harapan Bangsa

# API Documentation

This document provides information on how to use the API endpoints and their functionalities.

# Setup Project
To run this project, Install it locally using npm on your pc
```
# clone repository
$ git clone https://github.com/Warna-Ku/WarnaKu-Backend-API.git

# change directory to WarnaKu-Backend-API
$ cd WarnaKu-Backend-API
```
Please go to Google Cloud Console and create a service account with permissions for both Storage Object Admin and Storage Object Viewer

### Configure Node Module
```
# in WarnaKu-Backend-API

# install all depencencies using `npm install`

# run the backend using `npm start` or if you want to use dev environment you can hit `npm run dev`
```

## Recap Endpoint Routes
| Route                           | HTTP Method | Description                                  |
|---------------------------------|-------------|----------------------------------------------|
| /users                         | POST        | Sign up a new user       ✅                    |
| /users/login                         | POST        | Sign in a user                    ✅           |
| /users/update                         | PATCH        | Update current user by UID                    ✅           |
| /users/logout                        | DELETE        | Sign out a user                ✅              |
| /users                          | GET         | Get all users ✅                               |
| /users/:uid                     | GET         | Get specific user by UID       ✅                       | 
| /customers                     | POST         | Create customer data       ✅                       | 
| /customers/update                     | PATCH         | Update certain customer's data (partial data)       ✅                       | 
| /customers                     | GET         | Get all customers       ✅                       | 
| /customers/:customerID                    | GET         | Get specific customer by customerID      ✅                       | 

| /users/:uid/profile-picture         | PUT        | Upload a profile picture for a user           |
| /analysis                        | POST        | Perform a prediction using an uploaded image  |
| /records                        | GET         | Get all Analysis Records articles                             |
| /records/:uid                   | GET         | Get an Analysis Record by UID                         |

## Endpoints

### POST /users

Create a new user account.

#### Request
- Method: POST
- Path: /users
- Body Parameters:
```json
{
    "name": "Hanson",
    "email": "hanson@example.com",
    "password": "secret123"
}
```
#### Response

Success (HTTP 200):

```json
{
    "error": false,
    "message": "User created successfully",
    "data": {
        "uid": "b12d1e6f-a619-424e-9d5f-572af1be2fb3",
        "email": "hanson@example.com",
        "name": "Hanson"
    }
}
```


Failure (HTTP 400):
```json
{
    "error": true,
    "message": "Email's already registered"
}
```

### POST /users/login

Login and authenticate a user.

#### Request

- Method: POST
- Path: /users/login
- Body Parameters:
```json
{
    "email": "hanson@example.com",
    "password": "secret123"
}
```

#### Response

Success (HTTP 200):
```json
{
    "error": false,
    "message": "Login successfully",
    "loginResult": {
        "uid": "b12d1e6f-a619-424e-9d5f-572af1be2fb3",
        "name": "Hanson",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJiMTJkMWU2Zi1hNjE5LTQyNGUtOWQ1Zi01NzJhZjFiZTJmYjMiLCJuYW1lIjoiSGFuc29uIiwiZW1haWwiOiJoYW5zb25AZXhhbXBsZS5jb20iLCJpYXQiOjE3MTg3MjYxMjEsImV4cCI6MTcxODcyOTcyMX0.i6uqvq7P2XIWhujarbvllnzIN9F1X7gFazWGGehDbs4"
    }
}
```

Failure (HTTP 401):
```json
{
    "error": true,
    "message": "Email or password incorrect"
}
```

### PATCH /users/update

Update the current authenticated user's data (partial data)

#### Request

- Method: PATCH
- Path: /users/update
- Body Parameters:
```json
{
  "uid": "2320bd80-d825-5123-8913-03a98bab382d",
  "email": "Hanson Sujatmoko"
}
```

#### Response

Success (HTTP 200):
```json
{
    "error": false,
    "message": "Update successfully",
    "updateResult": {
        "email": "hanson@example.com",
        "name": "Hanson Sujatmoko"
    }
}
```

Failure (HTTP 400):
```json
{
    "error": true,
    "message": "User ID is required for update"
}
```

Failure (HTTP 404):
```json
{
    "error": true,
    "message": "User is not found"
}
```

### DELETE /users/logout

Logout the currently authenticated user.

#### Request

- Method: POST
- Path: /users/logout
- Body Parameters:
```json
{
  "uid": "2320bd80-d825-5123-8913-03a98bab382d"
}
```


#### Response

- Success (HTTP 200):
```json
{
    "error": false,
    "message": "Logout successfully"
}
```

Failure (HTTP 400):
```json
{
    "error": true,
    "message": "User ID is required for logout"
}
```

- Failure (HTTP 404):
```json
{
    "error": true,
    "message": "User is not found. User can't log out"
}
```

### GET /users

This endpoint is used to retrieve a list of users.

- Method: GET
- Path: /users
- Body Parameters: No parameters are required.

#### Response

Success (HTTP 200):
```json
{
    "error": false,
    "message": "All user's data is found",
    "listUser": [
        {
            "uid": "071446ff-74d7-487d-92a2-63a8c18aac9c",
            "email": "tole",
            "name": "tole@gmaill.com"
        },
        {
            "uid": "11c60636-1a4d-4b44-9527-37fc27ef83fb",
            "email": "onta@gmail.com",
            "name": "onta"
        },
        {
            "uid": "b12d1e6f-a619-424e-9d5f-572af1be2fb3",
            "email": "hanson@example.com",
            "name": "Hanson Sujatmoko"
        }
    ]
}
```

Error (HTTP 404):
```json
{
    "error": true,
    "message": "No Users Found"
}
```

### GET /users/:uid

- Method: GET
- Path: /users/:uid
- Route Parameters:
  - uid (string): The User ID (UID) of the user to retrieve.

#### Response

Success (HTTP 200):
```json
{
    "error": false,
    "message": "The user's data retrieved successfully",
    "user": {
        "uid": "b12d1e6f-a619-424e-9d5f-572af1be2fb3",
        "email": "hanson@example.com",
        "name": "Hanson Sujatmoko"
    }
}
```

Not Found (HTTP 404):
```json
{
    "error": true,
    "message": "User's data is not found"
}
```

Error (HTTP 500):
```json
{
    "error": true,
    "message": "Error in retrieving users"
}
```

### POST /customers

Create a new customers data.

#### Request
- Method: POST
- Path: /customers
- Body Parameters:
```json
{
    "fullname": "Mamang",
    "phone": "957563645837",
    "address": "Jalan Makmur",
    "email" : "mamang@example.com"
}
```
#### Response

Success (HTTP 200):

```json
{
    "error": false,
    "message": "Customer created successfully",
    "data": {
        "customerID": 13,
        "fullname": "Mamang",
        "phone": "957563645837",
        "address": "Jalan Makmur",
        "email": "mamang@example.com"
    }
}
```

Failure (HTTP 400):
```json
{
    "error": true,
    "message": "Email's already registered"
}
```

### PATCH /customers/update

Update certain customer's data (partial data)

#### Request

- Method: PATCH
- Path: /customers/update
- Body Parameters:
```json
{
    "customerID": 13,
    "phone": "08124356367467"
}
```

#### Response

Success (HTTP 200):
```json
{
    "error": false,
    "message": "Update successfully",
    "updateResult": {
        "customerID": 13,
        "fullname": "Mamang",
        "phone": "08124356367467",
        "address": "Jalan Makmur"
    }
}
```

Failure (HTTP 400):
```json
{
    "error": true,
    "message": "customerID is required for update"
}
```

Failure (HTTP 404):
```json
{
    "error": true,
    "message": "Customer is not found"
}
```

### GET /customers

This endpoint is used to retrieve a list of customers.

- Method: GET
- Path: /customers
- Body Parameters: No parameters are required.

#### Response

Success (HTTP 200):
```json
{
    "error": false,
    "message": "All Customer's data is found",
    "listCustomer": [
        {
            "fullname": "wildan ahmad",
            "phone": "082334163789",
            "address": "Roken Asri",
            "email": "wildanahmad@example.com",
            "faceImageURL": null
        },
        {
            "fullname": "faqih yusuf",
            "phone": "6547898",
            "address": "Roken Asri",
            "email": "faqih@example.com",
            "faceImageURL": null
        },
        {
            "fullname": "Mamang",
            "phone": "08124356367467",
            "address": "Jalan Makmur",
            "email": "mamang@example.com",
            "faceImageURL": null
        }
    ]
}
```

Error (HTTP 404):
```json
{
    "error": true,
    "message": "No customers found"
}
```

### GET /customers/:customerID

- Method: GET
- Path: /customers/:customerID
- Route Parameters:
  - customerID (string): The Customer ID (customerID) of the customer to retrieve.

#### Response

Success (HTTP 200):
```json
{
    "error": false,
    "message": "The customer's data retrieved successfully",
    "customer": {
        "customerID": 13,
        "fullname": "Mamang",
        "phone": "08124356367467",
        "address": "Jalan Makmur",
        "email": "mamang@example.com"
    }
}
```

Not Found (HTTP 404):
```json
{
    "error": true,
    "message": "Customer data is not found"
}
```