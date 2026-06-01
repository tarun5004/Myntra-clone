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

### Auth

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login user |
| POST | `/auth/refresh-token` | No | Generate fresh tokens |
| POST | `/auth/logout` | Yes | Logout user |

### Products

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/products` | No | Get all products |
| GET | `/products?category=electronics` | No | Filter products by category |
| GET | `/products/:id` | No | Get single product |
| POST | `/products` | Yes | Create product with optional images |
| PUT | `/products/:id` | Yes | Update product |
| DELETE | `/products/:id` | Yes | Delete product |

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
