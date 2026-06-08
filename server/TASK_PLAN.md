# E-Commerce Product API Task Plan

## Goal

Build a scalable Express + MongoDB e-commerce product API with:

- Feature-based architecture
- Access token and refresh token authentication
- Future-ready Google auth support
- Global error handling
- Request validation
- Product CRUD APIs
- Multiple image upload support
- Category filtering
- Complete API documentation
- Postman/Thunder Client testing

## Current Status

Completed:

- Basic Express server setup
- MongoDB connection
- Environment config
- Global `ApiError`
- `asyncHandler`
- Error middleware
- Validation middleware
- Auth model
- Auth service/controller/routes
- Access token and refresh token flow
- Auth middleware for protected routes
- Auth routes tested in Postman
- Product feature
- Multer upload middleware
- Product validation
- Product documentation
- Google auth
- Final testing checklist

Pending:

- Full manual Postman re-test after the latest commits

## Target Folder Structure

```txt
server/
  src/
    app.js
    config/
      db.js
      env.js
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
    uploads/
      products/
  API_DOCS.md
  TASK_PLAN.md
```

## Step Roadmap

### Step 1: Product Model

Create `src/features/product/product.model.js`.

Fields:

- `name`: String, required, trim
- `description`: String, optional
- `price`: Number, required, minimum 0
- `category`: String, trim, lowercase
- `images`: Array of strings, default empty array
- `createdBy`: ObjectId reference to User, optional but useful for ownership
- timestamps enabled

Purpose:

- Store product data in MongoDB
- Store uploaded image paths/URLs in the `images` array

### Step 2: Upload Middleware

Create `src/middlewares/upload.middleware.js`.

Use:

- `multer`
- memory storage
- image file filter
- max file size limit
- ImageKit upload from file buffers

Route usage later:

```txt
upload.array("images", 5)
```

Purpose:

- Accept multiple product images
- Use `req.files`, not `req.file`
- Convert uploaded file paths into image URLs/paths

### Step 3: Product Validation

Create `src/features/product/product.validation.js`.

Validate create product:

- `name` required
- `price` required and numeric
- `category` optional but trimmed
- `description` optional

Validate update product:

- fields optional
- if `price` exists, it must be numeric

Purpose:

- Stop invalid body data before controller/service
- Reuse existing `validate.middleware.js`

### Step 4: Product Service

Create `src/features/product/product.service.js`.

Service functions:

- `getAllProductsService(query)`
- `getProductByIdService(productId)`
- `createProductService(productData)`
- `updateProductService(productId, updateData)`
- `deleteProductService(productId)`

Rules:

- DB logic stays in service
- Controllers only handle HTTP request/response
- Invalid MongoDB ObjectId should return clean error
- Missing product should return 404

Category filtering:

```txt
GET /products?category=electronics
```

### Step 5: Product Controller

Create `src/features/product/product.controller.js`.

Controller functions:

- `getAllProducts`
- `getProductById`
- `createProduct`
- `updateProduct`
- `deleteProduct`

Rules:

- Use `asyncHandler`
- Read `req.files` for images
- Convert uploaded files into image paths
- Pass clean data to service
- Send consistent JSON responses

### Step 6: Product Routes

Create `src/features/product/product.routes.js`.

Endpoints:

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

Protection:

- Public: `GET /products`, `GET /products/:id`
- Protected: `POST`, `PUT`, `DELETE`

Middleware order for create/update:

```txt
verifyJWT -> upload.array("images", 5) -> validation rules -> validate -> controller
```

### Step 7: Mount Product Routes

In `src/app.js`, mount:

```txt
/api/v1/products
```

Final product URLs:

- `GET /api/v1/products`
- `GET /api/v1/products?category=electronics`
- `GET /api/v1/products/:id`
- `POST /api/v1/products`
- `PUT /api/v1/products/:id`
- `DELETE /api/v1/products/:id`

### Step 8: Static Upload Serving

Expose uploaded product images through Express static middleware.

Expected image path style:

```txt
/uploads/products/image-name.jpg
```

Purpose:

- Uploaded image paths should be accessible from browser/Postman
- Product response can include image URLs/paths

### Step 9: Product Postman Testing

Test in this order:

1. `GET /api/v1/products`
2. `POST /api/v1/products` without token should fail
3. Login and copy access token
4. `POST /api/v1/products` with token and multipart form-data
5. `GET /api/v1/products`
6. `GET /api/v1/products?category=electronics`
7. `GET /api/v1/products/:id`
8. `PUT /api/v1/products/:id`
9. `DELETE /api/v1/products/:id`
10. Invalid product ID should return clean error
11. Missing required fields should return validation error

### Step 10: API Documentation

Create `server/API_DOCS.md`. Completed.

Document every endpoint with:

- Route
- Method
- Authentication requirement
- Required fields
- Request body
- Query params
- Multipart fields
- Example request
- Example success response
- Example error response

Required sections:

- Auth APIs
- Product APIs
- Error response format
- Environment variables
- Testing notes

### Step 11: Google Auth

Completed using Google ID token verification.

Plan:

- Add Google env variables
- Add Google auth route
- Verify Google token/code
- Find or create user by email/googleId
- Set `authProvider: "google"`
- Generate access/refresh tokens using existing service pattern

Expected route:

```txt
POST /api/v1/auth/google
```

### Step 12: Final Review Checklist

Before submission:

- Server starts without errors
- MongoDB connects
- Auth routes work
- Refresh token works
- Logout works
- Product CRUD works
- Protected routes reject missing/invalid token
- Multiple image upload works
- Images are saved as array
- Category filtering works
- Validation errors are clean
- Invalid IDs return clean errors
- API docs are complete
- `.env` secrets are not committed

## Implementation Rule

For this project, keep this separation:

- Model: database schema only
- Service: business logic and database queries
- Controller: request/response only
- Routes: endpoint + middleware order only
- Middleware: reusable request processing
- Utils: reusable helpers/classes

## Next Step

Start with:

```txt
Step 1: Product Model
```

After each feature is implemented and tested, update this plan status only when requested.
