# Myntra Clone Backend

A feature-based e-commerce backend built with Node.js, Express, MongoDB, JWT authentication, refresh tokens, request validation, and ImageKit-powered product image uploads.

This repository is being built as a clean, scalable API system rather than a quick collection of routes. The project follows a layered architecture where routes, controllers, services, models, middleware, and utilities each have a clear job.

## What This API Covers

- User authentication with access tokens and refresh tokens
- Secure password hashing with bcrypt
- Protected routes using JWT middleware
- Cookie and Bearer token support
- Global error handling with a custom `ApiError`
- Central async error handling with `asyncHandler`
- Request validation using `express-validator`
- Product APIs with category filtering
- Multiple product image upload flow using Multer and ImageKit
- MongoDB data modeling with Mongoose
- Feature-based folder structure for maintainability
- Postman/Thunder Client friendly API testing flow

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Auth | JWT, bcrypt, cookie-parser |
| Validation | express-validator |
| File Handling | Multer |
| Image Storage | ImageKit |
| Environment | dotenv |
| Dev Server | Nodemon |

## Architecture

```txt
server/
  src/
    app.js
    config/
      db.js
      env.js
      imagekit.js
    features/
      auth/
        auth.model.js
        auth.service.js
        auth.controller.js
        auth.routes.js
        auth.validation.js
      product/
        product.model.js
        product.service.js
        product.controller.js
        product.routes.js
        product.validation.js
    middlewares/
      auth.middleware.js
      error.middleware.js
      upload.middleware.js
      validate.middleware.js
    utils/
      ApiError.js
      asyncHandler.js
  server.js
  TASK_PLAN.md
```

## Design Philosophy

The codebase follows a simple separation of concerns:

| Part | Responsibility |
| --- | --- |
| Model | Database schema and document methods |
| Service | Business logic and database operations |
| Controller | HTTP request and response handling |
| Route | Endpoint definition and middleware order |
| Middleware | Reusable request processing |
| Utility | Shared helpers and error classes |

This keeps the project easier to debug, test, and extend.

## Authentication Flow

The authentication system uses two JWTs:

- `accessToken`: short-lived token used to access protected routes
- `refreshToken`: long-lived token used to generate a new access token

Basic flow:

```txt
Register/Login
  -> generate access token
  -> generate refresh token
  -> save refresh token in database
  -> send tokens in response/cookies

Protected request
  -> read access token from cookie or Authorization header
  -> verify token
  -> attach user to req.user

Refresh token
  -> verify incoming refresh token
  -> compare with database token
  -> issue fresh access and refresh tokens

Logout
  -> clear refresh token from database
  -> clear auth cookies
```

## Product Image Upload Flow

Product images are not stored permanently on the local server. Multer reads files from `multipart/form-data`, keeps them in memory as buffers, and the service layer uploads those buffers to ImageKit.

```txt
Postman form-data
  -> Multer reads images
  -> files available in req.files
  -> ImageKit receives file.buffer
  -> ImageKit returns image URLs
  -> URLs are saved in Product.images
```

This keeps the API deployment-friendly because uploaded assets live in ImageKit instead of the server filesystem.

## API Endpoints

Base URL:

```txt
http://localhost:3000/api/v1
```

### Quick Route Summary

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login user |
| POST | `/auth/refresh-token` | No | Generate fresh tokens |
| POST | `/auth/logout` | Yes | Logout user |
| GET | `/products` | No | Get all products |
| GET | `/products?category=electronics` | No | Filter products by category |
| GET | `/products/:id` | No | Get single product |
| POST | `/products` | Yes | Create product with optional images |
| PUT | `/products/:id` | Yes | Update product |
| DELETE | `/products/:id` | Yes | Delete product |

## Detailed API Reference

### Auth APIs

#### Register User

```txt
POST /api/v1/auth/register
```

Authentication: Not required

Request body:

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

Success response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Tarun Raj Gaur",
      "email": "tarun@example.com",
      "authProvider": "local"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

Possible errors:

```json
{
  "success": false,
  "message": "User already exists with this email",
  "errors": []
}
```

Controller responsibility:

- Read request body
- Call auth service
- Set auth cookies
- Send response

Service responsibility:

- Check duplicate email
- Create user
- Hash password through model hook
- Generate and save refresh token
- Return user and tokens

#### Login User

```txt
POST /api/v1/auth/login
```

Authentication: Not required

Request body:

```json
{
  "email": "tarun@example.com",
  "password": "123456"
}
```

Validation:

- `email` is required and must be valid
- `password` is required

Success response:

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

Possible errors:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": []
}
```

Controller responsibility:

- Read credentials
- Call login service
- Set auth cookies
- Send token response

Service responsibility:

- Find user with password selected
- Compare password using bcrypt
- Generate fresh access and refresh tokens
- Save refresh token in database

#### Refresh Access Token

```txt
POST /api/v1/auth/refresh-token
```

Authentication: Refresh token required through cookie or body

Request body:

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

Success response:

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

Possible errors:

```json
{
  "success": false,
  "message": "Invalid or expired refresh token",
  "errors": []
}
```

Service responsibility:

- Verify refresh token
- Match incoming refresh token with database token
- Generate new token pair
- Save latest refresh token

#### Logout User

```txt
POST /api/v1/auth/logout
```

Authentication: Required

Header:

```txt
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

Service responsibility:

- Remove refresh token from database

Controller responsibility:

- Clear auth cookies
- Send logout response

### Product APIs

#### Get All Products

```txt
GET /api/v1/products
```

Authentication: Not required

Query params:

| Param | Required | Example | Description |
| --- | --- | --- | --- |
| category | No | electronics | Filters products by category |

Example:

```txt
GET /api/v1/products?category=electronics
```

Success response:

```json
{
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

Service responsibility:

- Build filter object from query params
- Fetch products from MongoDB
- Sort latest products first

#### Get Product By ID

```txt
GET /api/v1/products/:id
```

Authentication: Not required

Path params:

| Param | Required | Description |
| --- | --- | --- |
| id | Yes | MongoDB product ID |

Success response:

```json
{
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

Possible errors:

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

Service responsibility:

- Validate MongoDB ObjectId
- Fetch single product
- Return 404 if product does not exist

#### Create Product

```txt
POST /api/v1/products
```

Authentication: Required

Header:

```txt
Authorization: Bearer <accessToken>
```

Content type:

```txt
multipart/form-data
```

Form-data fields:

| Field | Type | Required | Example |
| --- | --- | --- | --- |
| name | Text | Yes | iPhone 15 |
| price | Text/Number | Yes | 79999 |
| category | Text | No | electronics |
| description | Text | No | Apple phone |
| images | File | No | image1.png |
| images | File | No | image2.png |

Success response:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "product_id",
    "name": "iPhone 15",
    "description": "Apple phone",
    "price": 79999,
    "category": "electronics",
    "images": [
      "https://ik.imagekit.io/example/products/iphone-15.png"
    ],
    "createdBy": "user_id"
  }
}
```

Possible validation error:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "price",
      "message": "Product price is required"
    }
  ]
}
```

Controller responsibility:

- Read `req.body`
- Read uploaded files from `req.files`
- Read user ID from `req.user`
- Call product service
- Return created product

Service responsibility:

- Upload images to ImageKit
- Collect ImageKit URLs
- Save product in MongoDB
- Attach `createdBy`

#### Update Product

```txt
PUT /api/v1/products/:id
```

Authentication: Required

Header:

```txt
Authorization: Bearer <accessToken>
```

Content type:

```txt
multipart/form-data
```

Allowed fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| name | Text | No | Updated product name |
| price | Text/Number | No | Updated product price |
| category | Text | No | Updated category |
| description | Text | No | Updated description |
| images | File | No | Optional new images |

Success response:

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "product_id",
    "name": "Updated iPhone 15",
    "description": "Updated description",
    "price": 74999,
    "category": "electronics",
    "images": [
      "https://ik.imagekit.io/example/products/new-image.png"
    ]
  }
}
```

Service responsibility:

- Validate product ID
- Upload new images only if files are provided
- Update only provided fields
- Return updated product

#### Delete Product

```txt
DELETE /api/v1/products/:id
```

Authentication: Required

Header:

```txt
Authorization: Bearer <accessToken>
```

Success response:

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

Possible errors:

```json
{
  "success": false,
  "message": "Product not found",
  "errors": []
}
```

Service responsibility:

- Validate product ID
- Delete product from MongoDB
- Optionally delete images from ImageKit if file IDs are stored later

## Environment Variables

Create a `.env` file inside `server/`.

```env
PORT=3000
NODE_ENV=development

MONGO_URL=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Never commit real `.env` secrets.

## Getting Started

Clone the repository and move into the backend folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

Expected server output:

```txt
Connected to MongoDB
Server is running on port 3000
```

## Testing With Postman

Recommended testing order:

1. Register a user
2. Login and copy the access token
3. Test logout with Bearer token
4. Login again
5. Create a product without images
6. Create a product with `form-data` images
7. Fetch all products
8. Fetch products by category
9. Fetch product by ID
10. Update product
11. Delete product

For protected product routes, use:

```txt
Authorization: Bearer <accessToken>
```

For image upload, use `form-data`:

| Key | Type | Example |
| --- | --- | --- |
| name | Text | iPhone 15 |
| price | Text | 79999 |
| category | Text | electronics |
| description | Text | Apple phone |
| images | File | image1.png |
| images | File | image2.png |

The file field name must be exactly:

```txt
images
```

## Error Response Format

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "price",
      "message": "Product price is required"
    }
  ]
}
```

## Current Project Status

Completed:

- Server setup
- MongoDB connection
- Environment validation
- Auth model, service, controller, and routes
- Access token and refresh token flow
- Auth middleware
- Global error handling
- Request validation system
- Product model
- ImageKit and Multer upload foundation

In progress:

- Product create endpoint
- Product CRUD service/controller/routes
- Product API testing
- API documentation

Planned:

- Google authentication
- Final endpoint documentation
- Full Postman test checklist

## Development Notes

This project uses a vertical-slice build style. Instead of writing all product services, controllers, and routes at once, each endpoint is completed and tested end to end before moving to the next one.

Example:

```txt
Create Product
  -> validation
  -> route
  -> controller
  -> service
  -> ImageKit upload
  -> MongoDB save
  -> Postman test
```

This makes debugging easier and keeps the codebase stable while features grow.

## Reference Plan

The detailed task roadmap lives here:

```txt
server/TASK_PLAN.md
```

Use it as the source of truth while building the remaining features.
