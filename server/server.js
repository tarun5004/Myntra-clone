import app from "./src/app.js";
import env from "./src/config/env.js";
import connectDB from "./src/config/db.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });

    // graceful shutdown ke liye signal handlers set karo, taaki server ko proper tarike se close kar sako jab SIGTERM ya SIGINT signal receive ho.
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Closing server...");
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    });
// SIGINT signal ke liye bhi same handler set karo, taaki Ctrl+C se server ko stop karne par bhi graceful shutdown ho sake.
    process.on("SIGINT", () => {
      console.log("SIGINT received. Closing server...");
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();