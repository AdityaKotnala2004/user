# User Registration Endpoint Documentation

## Endpoint

`POST /users/register`

## Description

Registers a new user in the system. Validates the input data, checks for existing users, hashes the password, creates the user, and returns an authentication token.

## Request Body

Send a JSON object with the following structure:

```
{
  "fullname": {
    "firstname": "<First Name>",
    "lastname": "<Last Name>" // optional
  },
  "email": "<user email>",
  "password": "<user password>"
}
```

- `fullname.firstname` (string, required): Minimum 3 characters
- `fullname.lastname` (string, optional): Minimum 3 characters if provided
- `email` (string, required): Must be a valid email address
- `password` (string, required): Minimum 6 characters

## Responses

### Success

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "token": "<JWT token>",
    "user": {
      "_id": "<user id>",
      "fullname": {
        "firstname": "<First Name>",
        "lastname": "<Last Name>"
      },
      "email": "<user email>"
      // ...other user fields
    }
  }
  ```

### Error Responses

- **400 Bad Request**
  - Validation errors (missing/invalid fields)
  - User already exists
  - **Body:**
    ```json
    {
      "errors": [ ... ]
      // or
      "message": "User already exist"
    }
    ```
- **Other errors**
  - Standard error format as per API

## Example Request

```
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

## Notes

- All required fields must be present and valid.
- The password is securely hashed before storing.
- On success, a JWT token is returned for authentication.

---

# User Login Endpoint Documentation

## Endpoint

`POST /users/login`

## Description

Authenticates an existing user. Validates the input data, checks credentials, and returns an authentication token if successful.

## Request Body

Send a JSON object with the following structure:

```
{
  "email": "<user email>",
  "password": "<user password>"
}
```

- `email` (string, required): Must be a valid email address
- `password` (string, required): Minimum 6 characters

## Responses

### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "token": "<JWT token>",
    "user": {
      "_id": "<user id>",
      "fullname": {
        "firstname": "<First Name>",
        "lastname": "<Last Name>"
      },
      "email": "<user email>"
      // ...other user fields
    }
  }
  ```

### Error Responses

- **400 Bad Request**
  - Validation errors (missing/invalid fields)
  - **Body:**
    ```json
    {
      "errors": [ ... ]
    }
    ```
- **401 Unauthorized**
  - Invalid email or password
  - **Body:**
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

## Example Request

```
POST /users/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

## Notes

- All required fields must be present and valid.
- On success, a JWT token is returned for authentication.

---

# User Profile Endpoint Documentation

## Endpoint

`GET /users/profile`

## Description

Returns the authenticated user's profile information. Requires a valid JWT token in the request (cookie or Authorization header).

## Authentication

- Requires authentication via JWT token (sent as a cookie or in the `Authorization: Bearer <token>` header).

## Responses

### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "_id": "<user id>",
    "fullname": {
      "firstname": "<First Name>",
      "lastname": "<Last Name>"
    },
    "email": "<user email>"
    // ...other user fields
  }
  ```

### Error Responses

- **401 Unauthorized**
  - Missing or invalid token
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```

## Example Request

```
GET /users/profile
Authorization: Bearer <JWT token>
```

## Notes

- Requires a valid JWT token for access.

---

# User Logout Endpoint Documentation

## Endpoint

`GET /users/logout`

## Description

Logs out the authenticated user by clearing the authentication token (cookie) and blacklisting the token. Requires a valid JWT token in the request.

## Authentication

- Requires authentication via JWT token (sent as a cookie or in the `Authorization: Bearer <token>` header).

## Responses

### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Logged out"
  }
  ```

### Error Responses

- **401 Unauthorized**
  - Missing or invalid token
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```

## Example Request

```
GET /users/logout
Authorization: Bearer <JWT token>
```

## Notes

- Requires a valid JWT token for access.
- The token is blacklisted after logout and cannot be reused.
