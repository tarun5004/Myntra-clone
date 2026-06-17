import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieparser from "cookie-parser";
import authRoutes from "./features/auth/auth.routes.js";
import productRoutes from "./features/product/product.routes.js";

let app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "..", "uploads");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // urlencoded middleware form data ko parse karta hai, taaki req.body me access kar sako. extended: true ka matlab hai ki nested objects ko bhi parse kar sakta hai, jo complex form data ke liye useful hota hai.
app.use(cookieparser()); // cookie parser middleware, taaki incoming request ke cookies ko parse kar sako, aur req.cookies me access kar sako.
app.use("/uploads", express.static(uploadsPath));


app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy",
    });
});

// temporary test route


// routes
app.use("/api/v1/auth", authRoutes); // authentication related routes ke liye authRoutes ko use karo, jisme registration/login/refresh token/logout routes defined hain.
app.use("/api/v1/products", productRoutes); // product related routes ke liye productRoutes ko use karo, jisme product creation/update/deletion/fetching routes defined hain.


// error middleware
app.use(errorMiddleware);

export default app;
