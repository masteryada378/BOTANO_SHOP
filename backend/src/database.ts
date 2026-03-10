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
 * Чому CREATE TABLE IF NOT EXISTS для нових таблиць?
 * — На відміну від ALTER, CREATE TABLE IF NOT EXISTS вже ідемпотентна за замовчуванням.
 *   Не потрібна додаткова перевірка EXISTS.
 *
 * Чому orders + order_items (дві таблиці)?
 * — Нормалізація: одне замовлення може містити багато товарів.
 *   Якщо зберігати всі товари в одному полі orders — втрачаємо можливість
 *   запитати "всі замовлення, що містять товар X" або порахувати статистику.
 */
export const runMigrations = async (): Promise<void> => {
    /**
     * Таблиця користувачів — має бути першою, бо orders матиме FK на users.
     *
     * email UNIQUE — один акаунт = один email. БД гарантує унікальність
     * навіть при race condition на рівні застосунку.
     *
     * role ENUM('user','admin') — обмежує допустимі значення на рівні БД.
     * SQL injection або баг не зможуть записати довільну роль.
     *
     * password_hash — зберігаємо тільки bcrypt-хеш, ніколи plaintext.
     */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("✅ Table users is ready");

    /**
     * Таблиця замовлень.
     * title і price в order_items — snapshot на момент замовлення.
     * status "pending" за замовчуванням — lifecycle: pending → confirmed → shipped → completed.
     */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_name VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(50) NOT NULL,
            customer_email VARCHAR(255) NOT NULL,
            delivery_method VARCHAR(50) NOT NULL,
            delivery_address TEXT NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            total_price DECIMAL(10,2) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    /**
     * Позиції замовлення (нормалізована структура).
     * title і price — snapshot: якщо товар перейменують/змінять ціну —
     * старі замовлення зберігають оригінальні дані.
     * ON DELETE CASCADE: при видаленні замовлення — всі його позиції теж видаляються.
     */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            quantity INT NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
    `);

    console.log("✅ Tables orders and order_items are ready");

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
