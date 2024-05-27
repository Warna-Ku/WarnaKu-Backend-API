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
| /users/signup                         | POST        | Sign up a new user                           |
| /users/signin                         | POST        | Sign in a user                               |
| /users/signout                        | POST        | Sign out a user                              |
| /reset-password                 | POST        | Reset user's password                         |
| /users                          | GET         | Get all users                                |
| /users/:uid                     | GET         | Get current user by UID                              |
| /users/:uid                     | PUT         | Update current user's personal data by UID
| /upload-profile-picture         | POST        | Upload a profile picture for a user           |
| /upload/:uid                    | PUT         | Upload a profile picture with UID             |
| /analysis                        | POST        | Perform a prediction using an uploaded image  |
| /records                        | GET         | Get all Analysis Records articles                             |
| /records/:uid                   | GET         | Get an Analysis Record by UID                         |

## Endpoints

### POST /users/signup

Create a new user account.

#### Request
- Method: POST
- Path: /users/signup
- Body Parameters:
```json
  {
    "name": "Takahashi Ran",
    "email": "takaran@example.com",
    "phone": "1234567890",
    "password": "password123"
  }
```
#### Response

- Success (HTTP 200):
  - success (boolean): `true`
  - msg (string): "Berhasil SignUp, silakan SignIn"

- Failure (HTTP 400):
  - success (boolean): `false`
  - msg (string): "Email telah terdaftar"

### POST /users/signin

Authenticate and sign in a user.

#### Request

- Method: POST
- Path: /users/signin
- Body Parameters:
```json
{
  "email": "takaran@example.com",
  "password": "password123"
}
```

#### Response

- Success (HTTP 200):
  - success (boolean): `true`
  - msg (string): "Berhasil Sign In"
  - data (object):
    - uid (string): User's unique ID.
    - email (string): User's email address.

- Failure (HTTP 404):
  - success (boolean): `false`
  - msg (string): "Error melakukan Sign In"

### GET /users

This endpoint is used to retrieve a list of users.

- Method: GET
- Path: /users
- Body Parameters: No parameters are required.

#### Response

- Success (HTTP 200):
  - success (boolean): true
  - msg (string): "Berhasil"
- Error (HTTP 500):
  - success (boolean): false
  - log : Error getting articles
  - msg (string): "Terjadi kesalahan, tunggu beberapa saat"

#### Example JSON Data Response
```json
{
    "success": true,
    "msg": "Success",
    "data": [
        {
            "id": "1",
            "name": "Takahashi Ran",
            "email": "takaran@example.com"
        },
        {
            "id": "2",
            "name": "Bruno Faran",
            "email": "brunofaran@example.com"
        }
    ]
}
```

### GET /users/:uid

- Method: GET
- Path: /users/:uid
- Route Parameters:
  - uid (string): The User ID (UID) of the user to retrieve.

- Example Request: GET /users/aghtJk918Yupio1

#### Response

- Success (HTTP 200):
  - success (boolean): true
  - msg (string): "Berhasil"
  - data (object): Data user yang ditemukan
- Not Found (HTTP 404):
  - success (boolean): false
  - msg (string): "User tidak ditemukan"
- Error (HTTP 500):
  - success (boolean): false
  - msg (string): "Terjadi kesalahan, tunggu beberapa saat"

#### Example JSON Data Response
```json
{
    "success": true,
    "msg": "Success",
    "data": {
        "id": "1",
        "name": "Takahashi Ran",
        "email": "takaran@example.com"
    }
}
```

### PUT /users/:uid





 