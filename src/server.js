import express from "express";
import {config} from "dotenv";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import watchlistRoutes from "./routes/watchlistRoutes.js"
import { connectDB ,disconnectDB} from "./config/db.js";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

config()
connectDB();

const app = express();

// body parse middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(fileUpload())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/movies",movieRoutes);
app.use("/auth",authRoutes);
app.use("/watchlist",watchlistRoutes);

app.get('/hello', (req,res) => {
  res.json({message:"hello world"})
  
})

const PORT = 5001;
const server = app.listen(PORT,()=> {
  console.log(`server running op port ${PORT}`);
});


// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

// GET, POST, DELETE,PUT

