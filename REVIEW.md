# Repository Review - Myntra Clone Backend

Reviewer: Sujal Rajput  
Repository owner: Tarun Raj  
Assigned repository: https://github.com/tarun5004/Myntra-clone  
Review branch: `review/sujal`  
Review date: 2026-06-18

## Overview

This review covers the Express/MongoDB backend in `server/`. The project uses a feature-based structure with separate models, services, controllers, routes, middleware, and utility classes. The core auth and product CRUD flows were kept intact while targeted fixes were added for authorization, product list performance, and token parsing.

## Issues Found

| ID | Severity | Area | Status | Notes |
| --- | --- | --- | --- | --- |
| SEC-01 | High | Product authorization | Fixed | Any authenticated user could update or delete any product by ID because update/delete services did not verify `createdBy` ownership. |
| PERF-01 | Medium | Product listing | Fixed | `GET /products` always queried all matching products, which can become slow as the collection grows. |
| AUTH-01 | Medium | JWT middleware | Fixed | Bearer token extraction used a plain string replacement and could accept malformed authorization headers. |
| DOC-01 | Low | API documentation | Fixed | Product pagination and owner-only mutation behavior were not documented after the review fixes. |
| TEST-01 | Medium | Test coverage | Open | `server/package.json` has `start` and `dev` scripts but no automated test script. |
| DEP-01 | Medium | Dependencies | Open | `npm install` reported 4 audit vulnerabilities and deprecation warnings for `imagekit@6.0.0` and `uuid@8.3.2`. |
| CORS-01 | Low | Frontend integration | Open | The `cors` package is installed, but the Express app does not currently configure CORS for browser clients. |

## Fixes Applied

1. `fix(auth): parse bearer tokens safely` (`c13e9f3`)
   - Added a dedicated Bearer token parser in `server/src/middlewares/auth.middleware.js`.
   - Prevents malformed auth headers from being treated as valid token strings.

2. `fix(product): restrict mutations to owners` (`a649e30`)
   - Added product ownership checks before update and delete operations.
   - Passes the authenticated user ID from the controller to the service layer.
   - Returns `403` when a user tries to mutate a product they did not create.

3. `perf(product): add bounded list pagination` (`d9d3d46`)
   - Added optional `page` and `limit` query handling to `GET /products`.
   - Caps `limit` at 100 to avoid very large unbounded reads.
   - Preserves the existing default response shape when no pagination is requested.

4. Documentation update
   - Updated `README.md` and `server/API_DOCS.md` for pagination and owner-only product mutations.
   - Added this review document for the assignment submission.

## Setup Instructions

```bash
cd server
npm install
```

Create a `.env` file inside `server/` using `server/.env.example` as the template:

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

Run the development server:

```bash
npm run dev
```

Base API URL:

```txt
http://localhost:3000/api/v1
```

## Verification

Completed checks:

```bash
node --check src/middlewares/auth.middleware.js
node --check src/features/product/product.controller.js
node --check src/features/product/product.service.js
```

Dependency install was completed with:

```bash
npm install
```

No automated test suite exists in the repository yet, so endpoint behavior still needs manual Postman or Thunder Client verification against a configured MongoDB and ImageKit environment.

## Future Enhancement Suggestions

- Add automated API tests for auth, refresh token, product ownership, product CRUD, invalid ObjectId handling, and validation errors.
- Add CORS configuration with an environment-driven allowed origin and `credentials: true` for cookie-based frontend clients.
- Add request rate limiting and security headers for production readiness.
- Store ImageKit file IDs along with URLs so old images can be removed when products are updated or deleted.
- Add response metadata for paginated product lists while maintaining backward compatibility for clients.
- Review and update vulnerable/deprecated packages, especially the deprecated `imagekit` package.
