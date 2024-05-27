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

### GET /users/:uid

### PUT /users/:uid





 