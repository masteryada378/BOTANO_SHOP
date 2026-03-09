import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cardRoutes from "./routes/cards";
import { runMigrations } from "./database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
);
app.use(express.json());

app.use("/cards", cardRoutes);

app.get("/api/health", (_req, res) => {
    res.send({ message: "Server is running" });
});

/**
 * Запускаємо міграції перед стартом сервера.
 *
 * Чому не просто app.listen()?
 * — Гарантуємо, що схема БД актуальна до того, як сервер почне приймати запити.
 *   Якщо міграція впаде — сервер не стартує, що краще ніж тихий баг у runtime.
 */
runMigrations()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Migration failed, server not started:", err);
        process.exit(1);
    });
