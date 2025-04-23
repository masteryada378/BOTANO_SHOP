import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cardRoutes from "./routes/cards";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

app.use("/cards", cardRoutes);

app.get("/api/health", (_req, res) => {
    res.send({ message: "Server is running" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
