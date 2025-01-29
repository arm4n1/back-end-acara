import express from "express";
import router from "./routes/api";
import db from "./utils/database";

const app = express();

// Inisialisasi database
async function init() {
  try {
    await db();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Keluar jika database gagal
  }
}

init();

// Middleware
app.use(express.json()); // Ganti bodyParser dengan express.json()

// Endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Server is running",
    data: null
    });
});

app.use("/api", router);

// Ekspor sebagai serverless function
export default app;