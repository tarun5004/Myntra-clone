import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
let app = express();




// error middleware
app.use(errorMiddleware);

export default app;