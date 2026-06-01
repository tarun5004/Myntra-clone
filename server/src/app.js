import express from "express";
import errorMiddleware from "./middlewares/error.middeware.js";
let app = express();




// error middleware
app.use(errorMiddleware);

export default app;