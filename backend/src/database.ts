import mysql from "mysql2/promise"; // проміси для async/await
import dotenv from "dotenv";

dotenv.config();

// 🔧 1. Створюємо пул з'єднань (не одне з'єднання!)
export const pool = mysql.createPool({
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "spor_shop",
    waitForConnections: true,
    connectionLimit: 10, // максимум 10 одночасних клієнтів
    queueLimit: 0, // без обмеження черги
});
