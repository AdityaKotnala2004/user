# Captain Routes Documentation

## Captain List Endpoint

### Endpoint

`GET /captains`

### Description

Returns a list of all captains registered in the system. This endpoint is typically used for admin or service purposes and may require authentication/authorization depending on your implementation.

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  [
    {
      "_id": "<captain id>",
      "fullname": {
        "firstname": "<First Name>",
        "lastname": "<Last Name>"
      },
      "email": "<captain email>",
      "vehicle": {
        "color": "<vehicle color>",
        "plate": "<vehicle plate>",
        "capacity": <vehicle capacity>,
        "vehicleType": "car|moto|auto|sedan|suv"
      },
      "status": "active|inactive",
      // ...other captain fields
    }
    // ...more captains
  ]
  ```

#### Error Responses

- **401 Unauthorized** (if authentication is required)
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```
- **403 Forbidden** (if authorization is required)
  - **Body:**
    ```json
    {
      "message": "Not authorized"
    }
    ```

### Example Request

```
GET /captains
```

---

## Captain Registration Endpoint

### Endpoint

`POST /captains/register`

### Description

Registers a new captain (driver) in the system. Validates input data, checks for existing captains, hashes the password, creates the captain, and returns an authentication token.

### Request Body

Send a JSON object with the following structure:

```
{
  "fullname": {
    "firstname": "<First Name>",
    "lastname": "<Last Name>" // optional
  },
  "email": "<captain email>",
  "password": "<captain password>",
  "vehicle": {
    "color": "<vehicle color>",
    "plate": "<vehicle plate>",
    "capacity": <vehicle capacity>,
    "vehicleType": "car|moto|auto|sedan|suv"
  }
}
```

- `fullname.firstname` (string, required): Minimum 3 characters
- `fullname.lastname` (string, optional): Minimum 3 characters if provided
- `email` (string, required): Must be a valid email address
- `password` (string, required): Minimum 6 characters
- `vehicle.color` (string, required): Minimum 3 characters
- `vehicle.plate` (string, required): Minimum 3 characters
- `vehicle.capacity` (integer, required): Minimum 1
- `vehicle.vehicleType` (string, required): Must be one of `car`, `moto`, `auto`, `sedan`, `suv`

### Responses

#### Success

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "token": "<JWT token>",
    "captain": {
      "_id": "<captain id>",
      "fullname": {
        "firstname": "<First Name>",
        "lastname": "<Last Name>"
      },
      "email": "<captain email>",
      "vehicle": {
        "color": "<vehicle color>",
        "plate": "<vehicle plate>",
        "capacity": <vehicle capacity>,
        "vehicleType": "car|motorcycle|auto|sedan|suv"
      }
      // ...other captain fields
    }
  }
  ```

#### Error Responses

- **400 Bad Request**
  - Validation errors (missing/invalid fields)
  - Captain already exists
  - **Body:**
    ```json
    {
      "errors": [ ... ]
      // or
      "message": "Captain already exist"
    }
    ```
- **Other errors**
  - Standard error format as per API

### Example Request

```
POST /captains/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "securePassword123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "sedan"
  }
}
```

---

## Captain Login Endpoint

### Endpoint

`POST /captains/login`

### Description

Authenticates an existing captain. Validates input data, checks credentials, and returns an authentication token if successful.

### Request Body

```
{
  "email": "<captain email>",
  "password": "<captain password>"
}
```

- `email` (string, required): Must be a valid email address
- `password` (string, required): Minimum 6 characters

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "token": "<JWT token>",
    "captain": {
      "_id": "<captain id>",
      "fullname": {
        "firstname": "<First Name>",
        "lastname": "<Last Name>"
      },
      "email": "<captain email>",
      "vehicle": {
        "color": "<vehicle color>",
        "plate": "<vehicle plate>",
        "capacity": <vehicle capacity>,
        "vehicleType": "car|motorcycle|auto|sedan|suv"
      }
      // ...other captain fields
    }
  }
  ```

#### Error Responses

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

### Example Request

```
POST /captains/login
Content-Type: application/json

{
  "email": "jane.smith@example.com",
  "password": "securePassword123"
}
```

---

## Captain Profile Endpoint

### Endpoint

`GET /captains/profile`

### Description

Returns the authenticated captain's profile information. Requires a valid JWT token in the request (cookie or Authorization header).

### Authentication

- Requires authentication via JWT token (sent as a cookie or in the `Authorization: Bearer <token>` header).

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "_id": "<captain id>",
    "fullname": {
      "firstname": "<First Name>",
      "lastname": "<Last Name>"
    },
    "email": "<captain email>",
    "vehicle": {
      "color": "<vehicle color>",
      "plate": "<vehicle plate>",
      "capacity": <vehicle capacity>,
      "vehicleType": "car|motorcycle|auto|sedan|suv"
    }
    // ...other captain fields
  }
  ```

#### Error Responses

- **401 Unauthorized**
  - Missing or invalid token
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```

### Example Request

```
GET /captains/profile
Authorization: Bearer <JWT token>
```

---

## Captain Logout Endpoint

### Endpoint

`GET /captains/logout`

### Description

Logs out the authenticated captain by clearing the authentication token (cookie) and blacklisting the token. Requires a valid JWT token in the request.

### Authentication

- Requires authentication via JWT token (sent as a cookie or in the `Authorization: Bearer <token>` header).

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Logged out"
  }
  ```

#### Error Responses

- **401 Unauthorized**
  - Missing or invalid token
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```

### Example Request

```
GET /captains/logout
Authorization: Bearer <JWT token>
```

---

## Notes

- All required fields must be present and valid.
- The password is securely hashed before storing.
- On success, a JWT token is returned for authentication.
- Vehicle details are required for registration.
- Allowed vehicle types: car, moto, auto, sedan, suv.
- Logout blacklists the token and clears the cookie.
