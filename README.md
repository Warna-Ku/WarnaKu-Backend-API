# WarnaKu-Backend-API Capstone C241-PS452

## Cloud Computing Member

* **C214D4KY1014** - Wildan Syaifudin Ahmad – Universitas Islam Indonesia
* **C003D4KY1285** - Kenneth Julian Perry – Institut Teknologi Harapan Bangsa

# API Documentation

This document provides information on how to use the API endpoints and their functionalities.

# Setup Project
To run this project, install it locally using npm on your pc
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
| /users/logout                        | POST        | Sign out a user                              |
| /users                          | GET         | Get all users ✅                               |
| /users/password                 | POST        | Reset user's password                         |
| /users/:uid                     | GET         | Get specific user by UID       ✅                       | 
| /users/:uid                     | PUT         | Update current user's personal data by UID
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
    "name": "Takahashi Ran",
    "email": "takaran@example.com",
    "password": "password123"
  }
```
#### Response

Success (HTTP 200):

```json
{
    "status": "Success",
    "msg": "User added Successfully, please login",
    "uid": "User's unique ID"
}
```


Failure (HTTP 400):
```json
{
    "status": "Failure",
    "msg": "Username's already registered"
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
  "email": "takaran@example.com",
  "password": "password123"
}
```

#### Response

Success (HTTP 200):
```json
{
    "status": "Success",
    "msg": "Login successfully",
    "data": {
      "uid": "User's unique ID",
      "email": "takaran@example.com",
      "token": "Unique-token"
    }
}
```

Failure (HTTP 404):
```json
{
    "status": "Failure",
    "msg": "username or password wrong"
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
    "status": "Success",
    "msg": "All data is retrieved successfully",
    "data": [
        {
            "id": "1",
            "name": "Takahashi Ran",
            "email": "takaran@example.com",
            "phone": "1234567890"
        },
        {
            "id": "2",
            "name": "Bruno Faran",
            "email": "brunofaran@example.com",
            "phone": "345667890"
        }
    ]
}
```

Error (HTTP 500):
```json
{
    "status": "Failure",
    "msg": "Error in retrieving users"
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
    "status": "Success",
    "msg": "User's data is found",
    "data": {
        "uid": "1",
        "name": "Takahashi Ran",
        "email": "takaran@example.com",
        "phone": "1234567890"
    }
}
```

Not Found (HTTP 404):
```json
{
    "status": "Failure",
    "msg": "User's data is not found"
}
```

Error (HTTP 500):
```json
{
    "status": "Failure",
    "msg": "Error in retrieving users"
}
```


### PUT /users/:uid





 