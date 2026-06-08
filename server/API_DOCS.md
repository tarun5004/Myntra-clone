# API Documentation

Base URL:

```txt
http://localhost:3000/api/v1
```

## Response Format

Success responses use:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success message",
  "data": {}
}
```

Error responses use:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Auth APIs

### Register

```txt
POST /auth/register
```

Auth: Not required

Body:

```json
{
  "name": "Tarun Raj Gaur",
  "email": "tarun@example.com",
  "password": "123456"
}
```

Validation:

- `name` is required
- `email` is required and must be valid
- `password` is required and must be at least 6 characters

Success:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Tarun Raj Gaur",
      "email": "tarun@example.com"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### Login

```txt
POST /auth/login
```

Auth: Not required

Body:

```json
{
  "email": "tarun@example.com",
  "password": "123456"
}
```

Success:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Tarun Raj Gaur",
      "email": "tarun@example.com"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### Google Login

```txt
POST /auth/google
```

Auth: Not required

Body:

```json
{
  "idToken": "google_id_token_from_frontend"
}
```

Success:

```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Tarun Raj Gaur",
      "email": "tarun@example.com",
      "googleId": "google_subject_id",
      "avatar": "https://lh3.googleusercontent.com/avatar.png",
      "authProvider": "google"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

Errors:

```json
{
  "success": false,
  "message": "Invalid Google token",
  "errors": []
}
```

### Refresh Token

```txt
POST /auth/refresh-token
```

Auth: Refresh token required through cookie or body

Body:

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

Success:

```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

### Logout

```txt
POST /auth/logout
```

Auth: Required

Header:

```txt
Authorization: Bearer <accessToken>
```

Success:

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

## Product APIs

### Get All Products

```txt
GET /products
```

Auth: Not required

Query params:

| Name | Required | Description |
| --- | --- | --- |
| category | No | Filters products by category |

Example:

```txt
GET /products?category=electronics
```

Success:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "product_id",
      "name": "iPhone 15",
      "description": "Apple phone",
      "price": 79999,
      "category": "electronics",
      "images": [
        "https://ik.imagekit.io/example/products/iphone.png"
      ],
      "createdBy": "user_id"
    }
  ]
}
```

### Get Product By ID

```txt
GET /products/:id
```

Auth: Not required

Success:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "_id": "product_id",
    "name": "iPhone 15",
    "description": "Apple phone",
    "price": 79999,
    "category": "electronics",
    "images": [
      "https://ik.imagekit.io/example/products/iphone.png"
    ],
    "createdBy": "user_id"
  }
}
```

Errors:

```json
{
  "success": false,
  "message": "Invalid product ID",
  "errors": []
}
```

```json
{
  "success": false,
  "message": "Product not found",
  "errors": []
}
```

### Create Product

```txt
POST /products
```

Auth: Required

Header:

```txt
Authorization: Bearer <accessToken>
```

Content type:

```txt
multipart/form-data
```

Form-data:

| Field | Type | Required |
| --- | --- | --- |
| name | Text | Yes |
| price | Text/Number | Yes |
| category | Text | No |
| description | Text | No |
| images | File | No |

Success:

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "product_id",
    "name": "iPhone 15",
    "description": "Apple phone",
    "price": 79999,
    "category": "electronics",
    "images": [
      "https://ik.imagekit.io/example/products/iphone.png"
    ],
    "createdBy": "user_id"
  }
}
```

### Update Product

```txt
PUT /products/:id
```

Auth: Required

Header:

```txt
Authorization: Bearer <accessToken>
```

Content type:

```txt
multipart/form-data
```

Allowed form-data:

| Field | Type | Required |
| --- | --- | --- |
| name | Text | No |
| price | Text/Number | No |
| category | Text | No |
| description | Text | No |
| images | File | No |

Success:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "product_id",
    "name": "Updated iPhone 15",
    "description": "Updated description",
    "price": 74999,
    "category": "electronics",
    "images": [
      "https://ik.imagekit.io/example/products/updated.png"
    ]
  }
}
```

### Delete Product

```txt
DELETE /products/:id
```

Auth: Required

Header:

```txt
Authorization: Bearer <accessToken>
```

Success:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

Errors:

```json
{
  "success": false,
  "message": "Product not found",
  "errors": []
}
```

## Environment Variables

```env
PORT=3000
NODE_ENV=development
MONGO_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

## Testing Checklist

- Register user
- Login user
- Refresh access token
- Logout user
- Google login with valid ID token
- Create product without images
- Create product with multiple images
- Fetch all products
- Filter by category
- Fetch product by ID
- Update product with text fields only
- Update product with images
- Delete product
- Test invalid product ID
- Test missing required product fields
- Test protected product routes without token
