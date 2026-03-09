import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/**
 * Пул з'єднань до MySQL.
 *
 * Чому пул, а не одне з'єднання?
 * — При паралельних запитах кожен отримує своє з'єднання з пулу,
 *   а не чекає в черзі на єдине. Це критично для production-навантаження.
 */
export const pool = mysql.createPool({
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "spor_shop",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/**
 * Auto-migration при старті бекенду.
 *
 * Чому auto-migration, а не ручний SQL?
 * — Для навчального проєкту це найпростіший підхід: сервер самостійно
 *   приводить схему БД у актуальний стан без ручного docker exec.
 *
 * Чому SHOW COLUMNS перед ALTER TABLE?
 * — ALTER TABLE завершиться помилкою, якщо колонка вже існує.
 *   Перевірка дозволяє зробити міграцію ідемпотентною (безпечний повторний запуск).
 *
 * Чому окремий ALTER для кожної колонки?
 * — Якщо одна колонка вже є, решта все одно додадуться без помилок.
 */
export const runMigrations = async (): Promise<void> => {
    const migrations: { column: string; sql: string }[] = [
        {
            column: "category",
            sql: "ALTER TABLE cards ADD COLUMN category VARCHAR(100) DEFAULT NULL",
        },
        /**
         * Поля для повноцінної сторінки товару (Task #14).
         *
         * description — розгорнутий опис товару, TEXT щоб не обмежувати розмір.
         * brand       — виробник/бренд (Marvel, Funko, Nintendo тощо).
         * old_price   — ціна до знижки; nullable, бо не всі товари мають акцію.
         * in_stock    — флаг наявності; DEFAULT TRUE — новий товар є в наявності за замовчуванням.
         *
         * Чому окремі ALTER?
         * — Якщо колонка вже існує (повторний запуск), тільки вона пропускається,
         *   решта все одно додаються. Ідемпотентна міграція без падіння сервера.
         */
        {
            column: "description",
            sql: "ALTER TABLE cards ADD COLUMN description TEXT DEFAULT NULL",
        },
        {
            column: "brand",
            sql: "ALTER TABLE cards ADD COLUMN brand VARCHAR(100) DEFAULT NULL",
        },
        {
            column: "old_price",
            sql: "ALTER TABLE cards ADD COLUMN old_price DECIMAL(10,2) DEFAULT NULL",
        },
        {
            column: "in_stock",
            sql: "ALTER TABLE cards ADD COLUMN in_stock BOOLEAN DEFAULT TRUE",
        },
    ];

    for (const migration of migrations) {
        const [rows] = await pool.query(
            "SHOW COLUMNS FROM cards LIKE ?",
            [migration.column],
        );
        const columns = rows as unknown[];
        if (columns.length === 0) {
            await pool.query(migration.sql);
            console.log(`✅ Migration applied: added column '${migration.column}'`);
        }
    }
};
