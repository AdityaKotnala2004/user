# Maps Routes Documentation

## Get Coordinates Endpoint

### Endpoint

`GET /maps/get-coordinates`

### Description

Fetches the geographical coordinates (latitude and longitude) for a given address.

### Request Parameters

- `address` (string, required): The address for which coordinates are to be fetched. Must be at least 3 characters long.

### Authentication

- Requires authentication via JWT token (sent as a cookie or in the `Authorization: Bearer <token>` header).

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "ltd": <latitude>,
    "lng": <longitude>
  }
  ```

#### Error Responses

- **400 Bad Request**
  - Validation errors (e.g., missing or invalid `address` parameter).
  - **Body:**
    ```json
    {
      "errors": [ ... ]
    }
    ```
- **401 Unauthorized**
  - Missing or invalid token.
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```

### Example Request

```
GET /maps/get-coordinates?address=1600+Amphitheatre+Parkway
Authorization: Bearer <JWT token>
```

---

## Get Distance and Time Endpoint

### Endpoint

`GET /maps/get-distance-time`

### Description

Calculates the distance and estimated travel time between an origin and a destination.

### Request Parameters

- `origin` (string, required): The starting point. Must be at least 3 characters long.
- `destination` (string, required): The destination point. Must be at least 3 characters long.

### Authentication

- Requires authentication via JWT token (sent as a cookie or in the `Authorization: Bearer <token>` header).

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "distance": {
      "text": "<distance in km>",
      "value": <distance in meters>
    },
    "duration": {
      "text": "<time in minutes>",
      "value": <time in seconds>
    }
  }
  ```

#### Error Responses

- **400 Bad Request**
  - Validation errors (e.g., missing or invalid `origin` or `destination` parameters).
  - **Body:**
    ```json
    {
      "errors": [ ... ]
    }
    ```
- **401 Unauthorized**
  - Missing or invalid token.
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```

### Example Request

```
GET /maps/get-distance-time?origin=New+York&destination=Los+Angeles
Authorization: Bearer <JWT token>
```

---

## Get Suggestions Endpoint

### Endpoint

`GET /maps/get-suggestions`

### Description

Provides autocomplete suggestions for a given input string, typically used for address or location search.

### Request Parameters

- `input` (string, required): The input string for which suggestions are to be fetched. Must be at least 3 characters long.

### Authentication

- Requires authentication via JWT token (sent as a cookie or in the `Authorization: Bearer <token>` header).

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  [
    "<suggestion 1>",
    "<suggestion 2>",
    "<suggestion 3>"
    // ...more suggestions
  ]
  ```

#### Error Responses

- **400 Bad Request**
  - Validation errors (e.g., missing or invalid `input` parameter).
  - **Body:**
    ```json
    {
      "errors": [ ... ]
    }
    ```
- **401 Unauthorized**
  - Missing or invalid token.
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```

### Example Request

```
GET /maps/get-suggestions?input=Central+Park
Authorization: Bearer <JWT token>
```

---

## Notes

- All endpoints require a valid JWT token for access.
- Ensure that the `address`, `origin`, `destination`, and `input` parameters are properly encoded for URL usage.
