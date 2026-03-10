# BOTANO_SHOP Roadmap

## 1) Baseline репозиторію (на зараз)

### Frontend

- Стек: React 19 + Vite + TypeScript + Tailwind.
- Є базовий layout і головна сторінка: `frontend/src/components/Layout.tsx`, `frontend/src/layouts/Header.tsx`, `frontend/src/pages/Home.tsx`.
- Роутинг мінімальний (фактично лише `/`): `frontend/src/routes/AppRoutes.tsx`.
- Глобальний стан кошика базовий: `frontend/src/context/AppContext.tsx`.
- Є CRUD-орієнтовані UI-компоненти товарів: `frontend/src/components/*`.

### Backend

- Стек: Node.js + Express + TypeScript + MySQL.
- Є один модуль `cards` з прямими SQL у роуті: `backend/src/routes/cards.ts`.
- Точка входу API: `backend/src/server.ts`.
- Підключення до БД: `backend/src/database.ts`.
- Архітектурні шари `controllers/services/models` поки не виділені.

### Infrastructure

- Локальний запуск через Docker Compose: `docker-compose.yml`.
- Контейнери: `frontend`, `backend`, `db`.
- Є техборг: хардкод env у compose, відсутність healthcheck/db readiness.

---

## 2) Архітектурні принципи (обов'язкові)

- **SOLID:** кожен модуль має одну відповідальність, мінімум залежностей між шарами.
- **DRY:** спільні типи, UI-патерни, утиліти й API-клієнт без копіпасту.
- **Clean Architecture (прагматично):**
  - Backend: `routes -> controllers -> services -> models`.
  - Frontend: `pages/features/components/services/types`.
- **TypeScript strict:** без `any`; DTO/response/request типізовані.
- **Mobile-first:** Bottom Navigation, drawer для фільтрів, flex/grid, мінімум absolute/fixed.

---

## 3) Функціональний обсяг (Scope)

1. Глобальні компоненти (Layout)

- Header (Верхня панель):
  - Логотип магазину (посилання на головну).
  - Рядок пошуку (Search Bar) — обов'язково з "живими" підказками.
  - Іконка кошика з індикатором кількості товарів (Badge).
  - Кнопка меню (Hamburger menu) або іконка профілю.
- Bottom Navigation (Нижня панель — must-have для Mobile):
  - Головна | Каталог | Кошик | Вибране (Wishlist) | Профіль.
- Footer (Підвал):
  - Посилання на соцмережі, контакти, умови повернення та FAQ.

1. Home Page (Головна сторінка)

- Hero Section: Динамічний банер (Slider) з акційними товарами (наприклад, нові фігурки Funko Pop або лімітовані комікси).
- Categories: Горизонтальний список категорій у вигляді іконок або карток (Marvel, Star Wars, DC тощо).
- Featured/Top Sellers: Сітка товарів (Grid) з основними картками:
  - Зображення, назва, ціна, кнопка "Додати в кошик" (Quick add).
- Newsletter: Блок підписки на новини "для своїх".

1. Products Page (Каталог)

- Хлібні крихти (Breadcrumbs): Навігаційний шлях (напр: Головна > Комікси > Marvel).
- Toolbar (Панель інструментів):
  - Кількість знайдених результатів.
  - Кнопка "Сортування" (ціна, популярність, новизна).
  - Кнопка "Фільтри" (у мобільній версії це має бути висувна панель або модальне вікно).
- Sidebar (або Filter Drawer):
  - Фільтрація за ціною (Range Slider).
  - Фільтр за брендом/всесвітом.
  - Фільтр за наявністю.
- Product Grid: Нескінченний скрол (Infinite scroll) або пагінація.

1. Product Detail Page (Сторінка товару)

- Image Gallery: Слайдер із зображеннями товару з можливістю збільшення (Zoom).
- Product Info:
  - Назва товару та бренд.
  - Ціна (та стара ціна, якщо є знижка).
  - Статус наявності (В наявності / Під замовлення).
- Product Configuration: Вибір атрибутів (розмір футболки, версія видання).
- Action Buttons: Кнопки "Купити" та "Додати в список бажаного".
- Descriptions & Tabs: Опис товару, характеристики, відгуки користувачів.

1. Admin (Адмін-панель)

- Каталог товарів: Додавання/редагування товарів, описів, цін, фотографій, категорій та характеристик.

1. Cart & Checkout (Кошик та Оформлення)

- Cart Page:
  - Список доданих товарів з можливістю зміни кількості (+/-).
  - Видалення товару.
  - Промокод (input).
  - Загальна сума (Subtotal).
- Checkout Flow:
  - Контактні дані (ім'я, телефон).
  - Вибір способу доставки (Нова Пошта, кур'єр).
  - Вибір способу оплати.
  - Підсумок замовлення (Order Summary).

1. User Profile (Кабінет користувача)

## 4) Етапи реалізації + Definition of Done

### Етап 0. Технічний фундамент

**Ціль:** стабільне середовище розробки та прозора конфігурація.

**DoD:**

- Додані `backend/.env.example` і `frontend/.env.example`.
- API URL і DB credentials не хардкодяться у коді.
- `db` має healthcheck, `backend` стартує після готовності БД.
- README містить актуальний quick start.

### Етап 1. Глобальний Layout

**Ціль:** закрити must-have оболонку мобільного магазину.

**DoD:**

- Header: логотип, пошук з live suggestions, динамічний cart badge.
- Mobile Bottom Navigation: Home/Catalog/Cart/Wishlist/Profile.
- Footer: контакти, FAQ, умови повернення, соцмережі.
- Вся навігація веде на реальні роути або валідні тимчасові заглушки.

### Етап 2. Каталог і пошук

**Ціль:** користувач може знайти потрібний товар швидко.

**DoD:**

- Є сторінка каталогу з breadcrumbs, toolbar, sort/filter.
- У мобільній версії фільтри відкриваються в drawer/modal.
- Є пагінація або стабільний infinite scroll.
- Пошук працює через API/дані і не блокує UI.

### Етап 3. Product Detail

**Ціль:** сторінка товару достатня для прийняття рішення про покупку.

**DoD:**

- Галерея зображень + zoom.
- Бренд/ціна/статус наявності/атрибути відображаються коректно.
- Кнопки `Купити` і `Wishlist` працюють.
- Опис/характеристики/відгуки структуровані табами або секціями.

### Етап 4. Cart + Checkout

**Ціль:** прозорий шлях від товару до оформлення.

**DoD:**

- У кошику можна змінювати кількість, видаляти позиції, бачити subtotal.
- Checkout збирає контакт, доставку, оплату, summary.
- Валідація форм обов'язкова (клієнтська мінімум).
- Стан кошика зберігається між перезавантаженнями.

### Етап 5. Auth + User Profile

**Ціль:** персоналізація і доступ до історії дій.

**DoD:**

- Є Login/Register і базовий auth flow.
- Захищені маршрути працюють коректно.
- Профіль, історія замовлень, wishlist доступні авторизованому юзеру.

### Етап 6. Admin

**Ціль:** керування каталогом без ручних SQL-танців.

**DoD:**

- CRUD для товарів/категорій/характеристик/зображень.
- Розмежування ролей (admin/user) перевіряється сервером.
- Валідація payload і контроль помилок централізовані.

### Етап 7. Якість і масштабованість

**Ціль:** контрольований ріст проєкту без технічного хаосу.

**DoD:**

- В backend усунені `any` і типізовані результати БД.
- Error handling стандартизований.
- Є базові тести критичних flow: cart/checkout/auth.
- Метрично видно, що зміни не ламають основний сценарій покупки.

---

## 5) MVP чеклист (must-have)

- Layout: Header + BottomNav + Footer
- Catalog з mobile filters + sorting
- Product Detail
- Cart
- Checkout
- Auth (Login/Register)
- Profile (мінімум: історія замовлень)
- Admin CRUD товарів

---

## 6) Атомарний backlog (по одному завданню)

### Блок A — Foundation

1. Додати `.env.example` для frontend/backend.
2. Винести API URL у frontend env (`VITE_API_URL`) і прибрати хардкод.
3. Додати healthcheck для `db` у `docker-compose.yml`.
4. Додати залежність `backend` від healthy `db`.
5. Оновити `README.md` інструкцією запуску й env.

### Блок B — Layout

1. Додати `BottomNavigation` компонент (mobile-first).
2. Підключити `BottomNavigation` у `Layout`.
3. Переробити cart badge у Header на дані з `AppContext`.
4. Додати базу для live-search (стан + debounce hook).
5. Підключити live suggestions dropdown до Header.

### Блок C — Catalog & Product

1. Створити сторінку `Catalog`.
2. Додати toolbar (count/sort/filter trigger).
3. Додати mobile filter drawer.
4. Додати маршрут `product/:id` і сторінку `ProductDetail`.
5. Підключити breadcrumbs для catalog/product.

### Блок D — Cart & Checkout

1. Розширити модель кошика (`id + quantity + price snapshot`).
2. Реалізувати сторінку `Cart`.
3. Реалізувати сторінку `Checkout` з валідацією.
4. Додати persist кошика в `localStorage`.

### Блок E — Auth/Profile/Admin

1. Додати `Login/Register` сторінки.
2. Додати `AuthContext` + protected routes.
3. Додати `Profile` + `OrderHistory`.
4. Додати backend модулі `auth/orders`.
5. Додати admin CRUD для товарів.

### Блок F — Quality

1. Рефактор backend у `controllers/services/models`.
2. Прибрати `any` у backend API.
3. Додати централізований `errorHandler`.
4. Додати базові тести критичних flow.

---

## 7) Робочий протокол (ти + я)

1. Я видаю **одне** завдання.
2. Ти імплементуєш і показуєш diff/файли.
3. Я роблю code review (типізація, архітектура, мобілка, ризики).
4. Фіксуємо покращення.
5. Даю наступне завдання.

---

## 8) Task #1 ✅ — Env foundation для передбачуваного запуску

Виконано. Створено `backend/.env.example`, `frontend/.env.example`, оновлено `README.md`.

---

## 9) Task #2 ✅ — Прибрати хардкод API URL у frontend

Виконано.

## 10) Task #3 ✅ — Healthcheck для MySQL у docker-compose

Виконано.

## 11) Task #4 ✅ — Backend має стартувати тільки після `db: healthy`

Виконано.

## 12) Task #5 ✅ — Оновити `README.md`: Quick Start + Environment + Troubleshooting

Виконано.

## 13) Task #6 ✅ — Створити `BottomNavigation` компонент (mobile-first)

Виконано.

## 14) Task #7 ✅ — Підключити `BottomNavigation` у `Layout`

Виконано.

---

## 15) Task #8 ✅ — Cart badge у Header від даних `AppContext`

Виконано. Badge кошика в Header тепер динамічний: бере `cart.length` з `AppContext`, ховається при 0, показує `99+` при переповненні, `aria-label` відповідає реальній кількості.

---

## 16) Task #9 ✅ — Фундамент live-search: стан, debounce hook, backend endpoint

Виконано. Створено хук `useDebounce<T>`, підключено controlled input у Header з debounce (300ms), розширено `GET /cards?q=` на бекенді (параметризований SQL, LIMIT 10), додано `searchCards()` у `cardService.ts`.

---

## 17) Task #10 ✅ — Live search suggestions dropdown у Header

Виконано. Створено компонент `SearchSuggestions` з live-підказками від API, хук `useClickOutside` для закриття при кліку поза блоком, Escape закриває пошук, race condition оброблений, a11y (`role="listbox"`, `aria-live`). Блок B (Layout) та Етап 1 повністю закриті.

---

## 18) Task #11 ✅ — Створити сторінку Catalog (Блок C — перший крок)

Виконано. Створено `CatalogCard` (клієнтська картка: зображення/placeholder, назва, ціна, "В кошик") та `CatalogPage` з grid (2/3/4 cols), loading/empty/error станами. Додано роут `/catalog`, увімкнено Catalog у `BottomNavigation`.

---

## 19) Task #12 ✅ — Toolbar для каталогу: лічильник, сортування, тригер фільтрів

Виконано. Створено `CatalogToolbar` (лічильник з відміною, `<select>` сортування, кнопка "Фільтри"-тригер). Backend: `GET /cards?sort=` з маппінгом `ORDER_MAP` (без SQL injection). Frontend: `useSearchParams` синхронізує сорт з URL, `SortOption` і `SORT_OPTIONS` у `types/catalog.ts`, `pluralize.ts` у `lib/`. Кнопка "Фільтри" поки `console.log` — drawer у Task #13.

---

## 20) Task #13 ✅ — Mobile Filter Drawer для каталогу

Виконано. Розширено БД (`category` VARCHAR), додано backend-фільтрацію (`?min_price=`, `?max_price=`, `?category=`), створено `FilterDrawer` з overlay/анімацією/body scroll lock, інтегровано з `CatalogPage` через URL-синхронізацію (`useSearchParams`). Кнопки "Застосувати"/"Скинути" працюють. `CatalogFilters`, `CATEGORIES` додано в `catalog.ts`.

---

## 21) Task #14 ✅ — Сторінка товару (Product Detail Page)

Виконано. Розширено БД (`description`, `brand`, `old_price`, `in_stock`), додано `GET /cards/:id` (404 для неіснуючих). Створено `ProductDetail` (mobile-first, md:grid-cols-2, зображення/бренд/ціна/знижка/статус/опис, "Додати в кошик" через `AppContext`, "В обране" — заглушка). `CatalogCard` і `SearchSuggestions` ведуть на `/product/:id`. Маршрут `/product/:id` у `AppRoutes`.

---

## 22) Task #15 ✅ — Breadcrumbs для каталогу та сторінки товару

Виконано. Створено `BreadcrumbItem` тип у `catalog.ts`. Компонент `Breadcrumbs` (`<nav>` + `<ol>`, `ChevronRight`-роздільник, `aria-current="page"` на останній крихті, іконка Home для першого елемента, `truncate` для довгих назв). Підключено до `CatalogPage` (динамічна третя крихта при активній категорії) та `ProductDetail` (скелетон під час loading, breadcrumbs після завантаження).

**Блок C (Catalog & Product) повністю закрито. Переходимо до Блоку D (Cart & Checkout).**

---

## 23) Task #16 ✅ — Розширити модель кошика + persist у localStorage

Виконано. Створено тип `CartItem` (`id`, `title`, `price`, `image?`, `quantity`), хелпери `getStorageItem`/`setStorageItem` для localStorage (`frontend/src/lib/storage.ts`). Перероблено `AppContext`: `cart: CartItem[]` з методами `addToCart`/`removeFromCart`/`updateQuantity`/`clearCart`, computed `totalItems`/`totalPrice`. Persist у localStorage (`botano_cart`) при кожній зміні. Оновлено `CatalogCard`, `ProductDetail`, Header badge, `BottomNavigation`.

---

## 24) Task #17 ✅ — Сторінка кошика (Cart Page)

Виконано. Створено `CartItemRow` (зображення, назва, ціна, +/−, subtotal, видалення) та `CartPage` (`/cart`) з Breadcrumbs, списком товарів, Order Summary (totalPrice, кнопка «Оформити замовлення»), пустим станом. Utility `formatPrice` (`Intl.NumberFormat("uk-UA")`). Header і BottomNavigation ведуть на `/cart`.

---

## 25) Task #18 ✅ — Сторінка Checkout з валідацією та збереженням замовлення

Виконано. Backend: таблиці `orders`/`order_items`, `POST /orders` з транзакцією. Frontend: `CheckoutPage` (`/checkout`) з формою (контакт, доставка, оплата), валідацією (`useCheckoutForm`), Order Summary, success/error/loading станами. Типи `CheckoutFormData`, `DELIVERY_METHODS`, `PAYMENT_METHODS`. API-сервіс `orderService.ts`.

**Блок D (Cart & Checkout) повністю закритий. Переходимо до Блоку E (Auth/Profile/Admin).**

---

## 26) Task #19 — Backend auth foundation (users + JWT + register/login/me)

**Назва:** Створити серверну інфраструктуру автентифікації: таблиця users, JWT, ендпоінти register/login/me, authMiddleware

**Бекграунд (Блок E — Auth/Profile/Admin, backend фундамент):**

Перший крок Блоку E. Все, що стосується auth на фронтенді (Login/Register сторінки, AuthContext, protected routes), потребує працюючого бекенду: ендпоінти реєстрації, логіну, перевірки токену. Без бекенд-фундаменту фронтенд auth — це mock-заглушки, які потребують переробки.

Тому починаємо з бекенду. Після цього Task #20 побудує фронтенд auth на вже працюючому API.

**Логіка (чому це робимо):**

- **Таблиця `users`** — зберігає облікові записи. `email` як login (стандарт для e-commerce), `password_hash` (НІКОЛИ plaintext), `role` для розмежування user/admin.
- **bcryptjs** — хешування паролів. Чому bcryptjs, а не bcrypt? Чиста JS-реалізація, не потребує нативної компіляції (працює у Docker без проблем із `node-gyp`). 10 раундів — баланс між безпекою та швидкістю.
- **JWT (JSON Web Token)** — stateless автентифікація. Сервер не зберігає сесії, а видає підписаний токен. Клієнт передає токен у `Authorization: Bearer <token>` при кожному запиті. Чому JWT, а не сесії? Простіше для SPA (без cookies/CSRF проблем), масштабується горизонтально.
- **authMiddleware** — перевіряє JWT перед доступом до захищених ресурсів. Витягує `userId` і `role` з токену і прикріплює до `req`. Перевикористовується у всіх захищених маршрутах.
- **GET /auth/me** — фронтенд відновлює сесію при перезавантаженні: читає token з localStorage → GET /auth/me → отримує user info. Якщо токен expired — 401, фронтенд чистить state.

**Scope:**

- Встановити `bcryptjs` + `jsonwebtoken` + `@types/bcryptjs` + `@types/jsonwebtoken`.
- Додати `JWT_SECRET`, `JWT_EXPIRES_IN` у `backend/.env.example`.
- Створити таблицю `users` у `runMigrations`.
- Створити типи auth у `backend/src/types/auth.ts`.
- Створити `backend/src/routes/auth.ts`: POST /auth/register, POST /auth/login, GET /auth/me.
- Створити `backend/src/middleware/authMiddleware.ts`.
- Підключити `authRouter` у `server.ts`.
- **НЕ** створюємо фронтенд сторінки (буде в Task #20).
- **НЕ** робимо refresh tokens (для MVP одного access token достатньо).
- **НЕ** робимо email verification, password reset (post-MVP features).

**Що зробити (покроково):**

### Крок 1 — Встановити залежності

- `bcryptjs` — хешування паролів (чиста JS, без native compilation).
- `jsonwebtoken` — створення і верифікація JWT.
- `@types/bcryptjs`, `@types/jsonwebtoken` — TypeScript типи.
- Встановлювати у `backend/` директорії.

### Крок 2 — Оновити `.env.example`

- **Файл:** `backend/.env.example` (update).
- Додати:
  - `JWT_SECRET=your_jwt_secret_change_me` — секретний ключ для підпису JWT.
  - `JWT_EXPIRES_IN=7d` — час життя токену (7 днів для MVP).
- **Чому у `.env`, а не у коді?** Secret ніколи не хардкодиться. Кожне середовище (dev, staging, prod) має свій ключ.

### Крок 3 — Створити таблицю `users`

- **Файл:** `backend/src/database.ts` (update — додати у `runMigrations`).
- **SQL:**

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- **Чому `ENUM('user', 'admin')`?** Обмежує допустимі значення на рівні БД. Не можна записати `role = 'superadmin'` через SQL injection або баг — БД відхилить.
- **Чому `UNIQUE` на email?** Один акаунт = один email. БД гарантує унікальність навіть при race condition.
- **Важливо:** `CREATE TABLE IF NOT EXISTS` — ідемпотентна міграція. Додати **перед** міграціями cards (users мають існувати раніше за можливі FK).

### Крок 4 — Створити типи auth

- **Файл:** `backend/src/types/auth.ts` (create).
- Створи типи/інтерфейси:

```typescript
export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}
```

- **Чому окремий файл типів?** Типи перевикористовуються в routes, middleware. Одна точка правди для auth-інтерфейсів.

### Крок 5 — Створити `authMiddleware`

- **Файл:** `backend/src/middleware/authMiddleware.ts` (create).
- **Логіка:**
  1. Зчитати заголовок `Authorization` з request.
  2. Перевірити формат `Bearer <token>`.
  3. Верифікувати token через `jwt.verify(token, JWT_SECRET)`.
  4. Декодувати payload → `{ userId, role }`.
  5. Прикріпити до `req.user = { id: userId, role }`.
  6. Викликати `next()`.
  7. Якщо токен відсутній, невалідний або expired → `401 Unauthorized`.
- **Чому middleware, а не перевірка в кожному route?** DRY. Middleware підключається одним рядком: `router.get("/me", authMiddleware, handler)`.

### Крок 6 — Створити auth routes

- **Файл:** `backend/src/routes/auth.ts` (create).

**POST /auth/register:**
1. Зчитати `name`, `email`, `password` з body.
2. Валідація: всі поля обов'язкові, email формат (базовий regexp), password мінімум 6 символів.
3. Перевірити: email вже існує? → `409 Conflict`.
4. Хешувати пароль: `bcrypt.hash(password, 10)`.
5. INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?).
6. Згенерувати JWT: `jwt.sign({ userId: insertId, role: 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })`.
7. Відповідь: `201 Created { token, user: { id, name, email, role } }`.

**POST /auth/login:**
1. Зчитати `email`, `password` з body.
2. Знайти user по email: SELECT * FROM users WHERE email = ?.
3. Якщо user не знайдений → `401 Unauthorized` (не казати "email не знайдений" — information disclosure).
4. Порівняти пароль: `bcrypt.compare(password, user.password_hash)`.
5. Якщо не збігається → `401 Unauthorized`.
6. Згенерувати JWT.
7. Відповідь: `200 OK { token, user: { id, name, email, role } }`.

**GET /auth/me:**
1. authMiddleware перевіряє токен і прикріплює `req.user`.
2. По `req.user.id` зробити SELECT id, name, email, role, created_at FROM users WHERE id = ? (без password_hash!).
3. Відповідь: `200 OK { id, name, email, role, created_at }`.

### Крок 7 — Підключити у `server.ts`

- **Файл:** `backend/src/server.ts` (update).
- Додати: `import authRouter from "./routes/auth"` та `app.use("/auth", authRouter)`.

**Файли для створення/змін:**

| Файл | Дія |
| --- | --- |
| `backend/src/routes/auth.ts` | **create** |
| `backend/src/types/auth.ts` | **create** |
| `backend/src/middleware/authMiddleware.ts` | **create** |
| `backend/src/database.ts` | update |
| `backend/.env.example` | update |
| `backend/src/server.ts` | update |

**Критерії приймання:**

- Таблиця `users` створюється при старті backend (ідемпотентно).
- `POST /auth/register` з валідними даними → `201 { token, user }`.
- `POST /auth/register` з існуючим email → `409 Conflict`.
- `POST /auth/register` з порожніми полями → `400 Bad Request`.
- `POST /auth/login` з правильними credentials → `200 { token, user }`.
- `POST /auth/login` з невірним паролем або email → `401 Unauthorized`.
- `GET /auth/me` з валідним token → `200 { id, name, email, role, created_at }`.
- `GET /auth/me` без token → `401`.
- `GET /auth/me` з expired/invalid token → `401`.
- Password зберігається як bcrypt hash (не plaintext).
- JWT містить `userId` та `role`.
- `JWT_SECRET` і `JWT_EXPIRES_IN` зчитуються з `.env`.
- Немає `any`, TypeScript strict.

---

## 27) Task #20 ✅ — Login/Register сторінки + AuthContext + protected routes

**Назва:** Фронтенд автентифікація: AuthContext, Login/Register сторінки, ProtectedRoute, інтеграція токену в api.ts

**Бекграунд (Блок E — Auth/Profile/Admin, фронтенд auth):**

Другий крок Блоку E. Backend auth (Task #19) готовий: є ендпоінти register/login/me, JWT, authMiddleware. Тепер фронтенд має: 1) зберігати стан авторизованого юзера, 2) надати UI для входу/реєстрації, 3) захистити приватні маршрути, 4) передавати токен у кожному API-запиті.

Цей таск об'єднує AuthContext + Login/Register + protected routes, бо вони тісно пов'язані: Login сторінка викликає `login()` з AuthContext, protected routes перевіряють `isAuthenticated` з AuthContext.

Після цього таску: юзер може зареєструватися, увійти, побачити що він авторизований. Task #21 додасть серверну прив'язку замовлень до юзера, Task #22 — сторінку профілю.

**Логіка (чому це робимо):**

- **AuthContext** — глобальний стан авторизації. Аналогічно AppContext для кошика, але для user/token. Чому Context, а не Zustand? Для auth одного рівня складності React Context достатній.
- **Token в localStorage** — при перезавантаженні сторінки юзер не повинен логінитися заново. localStorage зберігає token між сесіями. При mount: якщо token є → GET /auth/me → відновити user state.
- **api.ts інтеграція** — токен має автоматично додаватися до КОЖНОГО API-запиту через `Authorization: Bearer <token>`. Одна точка інтеграції в `request()` функції — не дублюємо логіку в кожному сервісі.
- **ProtectedRoute** — компонент-обгортка для маршрутів, доступних тільки авторизованим юзерам (/profile, /checkout при потребі). Redirect на /login якщо не авторизований.
- **Умовний UI** — Header і BottomNavigation мають відображати різний стан: гість бачить "Увійти", авторизований юзер бачить іконку профілю/ім'я.

**Scope:**

- Створити тип `User` у `frontend/src/types/user.ts`.
- Створити `AuthContext` з login/register/logout/user/isAuthenticated/isLoading.
- Створити `authService.ts` з API-функціями.
- Інтегрувати token у `api.ts` (Authorization header).
- Створити `LoginPage` (`/login`) з формою і валідацією.
- Створити `RegisterPage` (`/register`) з формою і валідацією.
- Створити `ProtectedRoute` компонент.
- Додати маршрути `/login`, `/register` у `AppRoutes`.
- Оновити Header: умовний рендер (Login vs Profile).
- Оновити BottomNavigation: увімкнути Profile tab.
- Обгорнути App у `AuthProvider`.
- **НЕ** робимо "Запам'ятати мене" checkbox (token і так в localStorage).
- **НЕ** робимо OAuth (Google/GitHub login) — post-MVP.
- **НЕ** робимо password strength indicator — post-MVP.

**Що зробити (покроково):**

### Крок 1 — Створити тип `User`

- **Файл:** `frontend/src/types/user.ts` (create).

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}
```

- **Чому окремий файл?** User — не Cart, не Card. Різна доменна модель → різний файл (SRP).

### Крок 2 — Створити `authService`

- **Файл:** `frontend/src/services/authService.ts` (create).
- Функції:
  - `registerUser(name, email, password): Promise<AuthResponse>` → POST /auth/register.
  - `loginUser(email, password): Promise<AuthResponse>` → POST /auth/login.
  - `fetchCurrentUser(): Promise<User>` → GET /auth/me.
- Використовує `apiPost`/`apiGet` з `api.ts`.
- **Чому сервіс, а не прямі fetch у компонентах?** Ізоляція API-логіки. Якщо ендпоінт зміниться — правимо один файл.

### Крок 3 — Інтегрувати token у `api.ts`

- **Файл:** `frontend/src/services/api.ts` (update).
- У функції `request()` — зчитати token з localStorage (`botano_token`), додати заголовок `Authorization: Bearer ${token}` якщо token існує.
- **Чому тут, а не в AuthContext?** api.ts — єдина точка для всіх HTTP-запитів. Додавання header тут гарантує, що КОЖЕН запит (cards, orders, auth/me) автоматично авторизований.
- **Важливо:** token читається з localStorage при КОЖНОМУ запиті (не кешується у змінній). Це гарантує актуальний token після login/logout без потреби оновлювати стан.

### Крок 4 — Створити `AuthContext`

- **Файл:** `frontend/src/context/AuthContext.tsx` (create).
- **Тип контексту:**

```typescript
type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};
```

- **Ініціалізація:** при mount перевіряє localStorage на наявність token. Якщо є → `fetchCurrentUser()` → встановити user. Якщо token невалідний → очистити localStorage. `isLoading = true` поки перевірка не завершиться (запобігає flash of login page).
- **login():** викликає `loginUser()` → зберігає token у localStorage → встановлює user у state.
- **register():** викликає `registerUser()` → зберігає token → встановлює user.
- **logout():** очищує token з localStorage → встановлює user = null.
- **Ключ localStorage:** `botano_token` — з префіксом проєкту (як `botano_cart`).

### Крок 5 — Створити `LoginPage`

- **Файл:** `frontend/src/pages/LoginPage.tsx` (create).
- **Маршрут:** `/login`.
- **UI (mobile-first, dark theme):**
  - Заголовок: "Вхід" або "Увійти до акаунту".
  - Поля: email (`type="email"`), password (`type="password"`).
  - Кнопка "Увійти": `bg-violet-600 hover:bg-violet-700 w-full py-3 rounded-xl`.
  - Помилка: червоний блок під формою якщо credentials невірні.
  - Loading state на кнопці при запиті.
  - Посилання: "Немає акаунту? Зареєструватися" → `/register`.
- **Валідація:**
  - Email: обов'язкове, базовий формат.
  - Password: обов'язкове, мінімум 6 символів.
- **Після логіну:** redirect на попередню сторінку або `/` (використай `useNavigate` + `location.state`).
- **Guard:** якщо юзер вже авторизований → redirect на `/profile`.

### Крок 6 — Створити `RegisterPage`

- **Файл:** `frontend/src/pages/RegisterPage.tsx` (create).
- **Маршрут:** `/register`.
- **UI:** аналогічний LoginPage, але з полями:
  - Ім'я (`type="text"`, мінімум 2 символи).
  - Email.
  - Пароль (мінімум 6 символів).
  - Підтвердження паролю (має збігатися з паролем).
- Кнопка "Зареєструватися".
- Помилка: "Email вже зайнятий" якщо 409.
- Посилання: "Вже є акаунт? Увійти" → `/login`.
- **Після реєстрації:** автоматичний вхід + redirect на `/`.

### Крок 7 — Створити `ProtectedRoute`

- **Файл:** `frontend/src/components/ProtectedRoute.tsx` (create).
- **Логіка:**
  - Якщо `isLoading` → показати spinner/skeleton (не redirect!).
  - Якщо `!isAuthenticated` → `<Navigate to="/login" state={{ from: location }} />`.
  - Якщо `isAuthenticated` → рендерити `<Outlet />` або `children`.
- **Чому компонент, а не HOC?** Composition pattern краще вписується у React Router v7 (`<Route element={<ProtectedRoute />}>`).

### Крок 8 — Оновити маршрути

- **Файл:** `frontend/src/routes/AppRoutes.tsx` (update).
- Додати:
  - `{ path: "login", element: <LoginPage /> }`.
  - `{ path: "register", element: <RegisterPage /> }`.
  - `{ path: "profile", element: <ProtectedRoute><ProfilePlaceholder /></ProtectedRoute> }` — тимчасова заглушка до Task #22.
- Видалити закоментований `/login` роут.

### Крок 9 — Оновити Header

- **Файл:** `frontend/src/layouts/Header.tsx` (update).
- Імпортувати `useAuth` (або `useAuthContext`).
- Умовний рендер:
  - **Не авторизований:** іконка `User` → `<Link to="/login">`, aria-label "Увійти".
  - **Авторизований:** іконка `User` → `<Link to="/profile">`, aria-label "Профіль (Ім'я)".
- Опціонально: показувати ім'я юзера поруч з іконкою на desktop.

### Крок 10 — Оновити BottomNavigation

- **Файл:** `frontend/src/layouts/BottomNavigation.tsx` (update).
- Увімкнути Profile tab (`enabled: true`).
- Лінк: якщо авторизований → `/profile`, якщо ні → `/login`.

### Крок 11 — Обгорнути App у AuthProvider

- **Файл:** `frontend/src/App.tsx` (update).
- Обгорнути `<AppRoutes />` у `<AuthProvider>` (аналогічно `<AppProvider>`).
- `AuthProvider` має бути всередині `AppProvider` або навпаки — залежно від того, чи потребують вони одне одного. Поки незалежні → порядок не критичний.

**Файли для створення/змін:**

| Файл | Дія |
| --- | --- |
| `frontend/src/types/user.ts` | **create** |
| `frontend/src/services/authService.ts` | **create** |
| `frontend/src/context/AuthContext.tsx` | **create** |
| `frontend/src/pages/LoginPage.tsx` | **create** |
| `frontend/src/pages/RegisterPage.tsx` | **create** |
| `frontend/src/components/ProtectedRoute.tsx` | **create** |
| `frontend/src/services/api.ts` | update |
| `frontend/src/routes/AppRoutes.tsx` | update |
| `frontend/src/layouts/Header.tsx` | update |
| `frontend/src/layouts/BottomNavigation.tsx` | update |
| `frontend/src/App.tsx` | update |

**Критерії приймання:**

- AuthContext надає user/token/isAuthenticated/isLoading/login/register/logout.
- Token зберігається в localStorage (`botano_token`), відновлюється при mount.
- api.ts автоматично додає `Authorization: Bearer <token>` до кожного запиту.
- LoginPage: форма з валідацією, реальна авторизація через API, помилки відображаються, redirect після логіну.
- RegisterPage: форма з валідацією (name/email/password/confirm), реальна реєстрація, автоматичний вхід, помилка "email зайнятий".
- ProtectedRoute: redirect на /login якщо не авторизований, spinner під час перевірки.
- Guard: авторизований юзер не бачить /login, /register (redirect на /profile).
- Header: умовний рендер Login vs Profile.
- BottomNavigation: Profile tab увімкнений.
- При logout: token видаляється, UI оновлюється.
- Немає `any`, TypeScript strict.

---

## 28) Task #21 ✅ — Backend orders auth integration (user_id + GET /orders)

**Назва:** Зв'язати замовлення з авторизованими юзерами, додати ендпоінти для отримання замовлень

**Бекграунд (Блок E — Auth/Profile/Admin, orders + auth зв'язка):**

Третій крок Блоку E. Auth працює (Tasks #19–20). Зараз замовлення (`orders`) не прив'язані до юзерів — будь-хто може створити замовлення, і немає способу отримати "мої замовлення". Для Profile/OrderHistory (Task #22) потрібно:
1. Зберігати `user_id` при створенні замовлення.
2. Надати ендпоінт для отримання замовлень конкретного юзера.
3. Надати ендпоінт для деталей одного замовлення.

**Логіка (чому це робимо):**

- **user_id в orders** — прив'язка замовлення до юзера. Nullable, бо: 1) існуючі замовлення (до auth) не мають юзера, 2) guest checkout має залишатися можливим.
- **Опціональний authMiddleware на POST /orders** — якщо юзер авторизований → зберігаємо user_id. Якщо ні → замовлення створюється як guest. Не блокуємо гостей, але персоналізуємо для авторизованих.
- **GET /orders** — авторизований юзер отримує тільки СВОЇ замовлення. Обов'язковий authMiddleware. Без auth → 401.
- **GET /orders/:id** — деталі одного замовлення (з позиціями). Перевірка ownership: юзер бачить тільки свої замовлення.

**Scope:**

- Додати колонку `user_id` до таблиці `orders` (nullable FK → users).
- Оновити `POST /orders`: зберігати user_id якщо авторизований.
- Створити `GET /orders`: список замовлень авторизованого юзера.
- Створити `GET /orders/:id`: деталі замовлення з позиціями (з перевіркою ownership).
- Оновити frontend `CheckoutPage`: передавати token при оформленні (вже працює через api.ts).
- **НЕ** робимо admin перегляд всіх замовлень (post-MVP).
- **НЕ** робимо зміну статусу замовлення з клієнта (admin feature).

**Що зробити (покроково):**

### Крок 1 — Додати `user_id` до таблиці `orders`

- **Файл:** `backend/src/database.ts` (update — додати міграцію).
- Додати ідемпотентну міграцію (перевірка SHOW COLUMNS перед ALTER):

```sql
ALTER TABLE orders ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
```

- **Чому `ON DELETE SET NULL`, а не `CASCADE`?** При видаленні юзера замовлення мають залишатися (для бухгалтерії/статистики), але `user_id` стане NULL.
- **Чому окремий ALTER, а не зміна CREATE TABLE?** Таблиця вже існує з даними. ALTER додає колонку до існуючої таблиці.

### Крок 2 — Створити опціональний auth middleware

- **Файл:** `backend/src/middleware/optionalAuthMiddleware.ts` (create) або додати як експорт з `authMiddleware.ts`.
- **Логіка:** як authMiddleware, але при відсутності/невалідності токену — НЕ повертає 401, а просто `next()` без `req.user`.
- **Чому окремий middleware?** POST /orders має працювати і з auth, і без. Стандартний authMiddleware поверне 401 для гостей, що зламає guest checkout.

### Крок 3 — Оновити `POST /orders`

- **Файл:** `backend/src/routes/orders.ts` (update).
- Підключити `optionalAuthMiddleware` до POST /.
- Якщо `req.user` існує → INSERT orders з `user_id = req.user.id`.
- Якщо `req.user` відсутній → INSERT orders з `user_id = NULL`.

### Крок 4 — Створити `GET /orders`

- **Файл:** `backend/src/routes/orders.ts` (update).
- authMiddleware обов'язковий.
- SQL: `SELECT o.*, COUNT(oi.id) as items_count FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = ? GROUP BY o.id ORDER BY o.created_at DESC`.
- Відповідь: масив `{ id, total_price, status, created_at, items_count }`.

### Крок 5 — Створити `GET /orders/:id`

- **Файл:** `backend/src/routes/orders.ts` (update).
- authMiddleware обов'язковий.
- SQL: SELECT order WHERE id = ? AND user_id = req.user.id.
- Якщо не знайдено → 404 (не розкриваємо чи замовлення існує — ownership check).
- Додатково: SELECT order_items WHERE order_id = id.
- Відповідь: `{ ...order, items: [...] }`.

**Файли для створення/змін:**

| Файл | Дія |
| --- | --- |
| `backend/src/middleware/optionalAuthMiddleware.ts` | **create** |
| `backend/src/database.ts` | update |
| `backend/src/routes/orders.ts` | update |

**Критерії приймання:**

- Колонка `user_id` додана до `orders` (nullable, FK → users).
- `POST /orders` з авторизованим юзером → `user_id` зберігається.
- `POST /orders` без авторизації → `user_id = NULL`, замовлення створюється (guest checkout працює).
- `GET /orders` з токеном → повертає тільки замовлення поточного юзера.
- `GET /orders` без токену → `401`.
- `GET /orders/:id` з токеном → повертає замовлення з позиціями (якщо належить юзеру).
- `GET /orders/:id` чужого замовлення → `404`.
- Міграція ідемпотентна (повторний запуск не падає).
- Немає `any`, TypeScript strict.

---

## 29) Task #22 ✅ — Profile + OrderHistory

**Назва:** Створити сторінку профілю з інформацією про юзера та історією замовлень

**Бекграунд (Блок E — Auth/Profile/Admin, фронтенд профіль):**

Четвертий крок Блоку E. Auth працює (Tasks #19–20), замовлення прив'язані до юзерів (Task #21). Тепер потрібен UI для авторизованого юзера: сторінка профілю з особистою інформацією та історією замовлень.

Це реалізує Етап 5 з DoD: "Профіль, історія замовлень, wishlist доступні авторизованому юзеру" (wishlist — post-MVP, відкладаємо).

**Логіка (чому це робимо):**

- **ProfilePage** — авторизований юзер хоче бачити: своє ім'я, email, коли зареєструвався, і головне — **історію замовлень**. Без цієї сторінки auth не має практичної цінності для юзера.
- **OrderHistory** — список замовлень з основною інформацією: номер, дата, статус, сума. Клік розгортає деталі (або окрема сторінка). Це дає юзеру відчуття контролю над своїми покупками.
- **Order status badges** — візуальне розрізнення статусів: pending (жовтий), confirmed (синій), shipped (фіолетовий), completed (зелений). Стандарт e-commerce UX.
- **Logout** — кнопка виходу на сторінці профілю. Очевидне місце для цієї дії.

**Scope:**

- Створити типи замовлень у `frontend/src/types/order.ts`.
- Оновити `orderService.ts`: додати `fetchOrders()` і `fetchOrderById()`.
- Створити компонент `OrderHistory`.
- Створити сторінку `ProfilePage` (`/profile`).
- Підключити маршрут `/profile` з ProtectedRoute у AppRoutes.
- **НЕ** робимо редагування профілю (зміна імені, email) — post-MVP.
- **НЕ** робимо wishlist на ProfilePage — post-MVP.
- **НЕ** робимо окрему сторінку для деталей замовлення — використовуємо expandable list.

**Що зробити (покроково):**

### Крок 1 — Створити типи замовлень

- **Файл:** `frontend/src/types/order.ts` (create).

```typescript
export interface OrderSummary {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  items_count: number;
}

export interface OrderDetail extends OrderSummary {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_method: string;
  delivery_address: string;
  payment_method: string;
  items: OrderDetailItem[];
}

export interface OrderDetailItem {
  id: number;
  product_id: number;
  title: string;
  price: number;
  quantity: number;
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Очікує", color: "bg-yellow-500/20 text-yellow-400" },
  confirmed: { label: "Підтверджено", color: "bg-blue-500/20 text-blue-400" },
  shipped: { label: "Відправлено", color: "bg-violet-500/20 text-violet-400" },
  completed: { label: "Виконано", color: "bg-emerald-500/20 text-emerald-400" },
};
```

### Крок 2 — Оновити `orderService.ts`

- **Файл:** `frontend/src/services/orderService.ts` (update).
- Додати функції:
  - `fetchOrders(): Promise<OrderSummary[]>` → GET /orders.
  - `fetchOrderById(id: number): Promise<OrderDetail>` → GET /orders/:id.
- Існуючий `createOrder()` залишити без змін.

### Крок 3 — Створити `OrderHistory`

- **Файл:** `frontend/src/components/OrderHistory.tsx` (create).
- **Props:** немає (компонент сам завантажує дані через `fetchOrders()`).
- **Стани:**
  - Loading: skeleton-список (3-4 рядки).
  - Empty: "У вас ще немає замовлень" + іконка Package + кнопка "До каталогу".
  - Error: повідомлення + кнопка "Спробувати ще".
  - Data: список замовлень.
- **Елемент списку (кожне замовлення):**
  - Номер замовлення: `#${order.id}`.
  - Дата: `new Date(order.created_at).toLocaleDateString("uk-UA")`.
  - Status badge: колір + текст з `ORDER_STATUS_MAP`.
  - Сума: `formatPrice(order.total_price)`.
  - Кількість товарів: `order.items_count`.
  - Expandable: клік розгортає деталі (завантажує `fetchOrderById`).
- **Деталі (expanded):**
  - Список позицій: назва × кількість = subtotal.
  - Спосіб доставки, оплати.
- **Семантика:** `<ul>` / `<li>`, `<details>` або custom expand.

### Крок 4 — Створити `ProfilePage`

- **Файл:** `frontend/src/pages/ProfilePage.tsx` (create).
- **Маршрут:** `/profile` (ProtectedRoute).
- **Layout (mobile-first):**
  1. **Breadcrumbs:** "Головна > Профіль".
  2. **Заголовок:** "Мій профіль".
  3. **User Info Card:**
     - Ім'я, email, роль (badge якщо admin).
     - Дата реєстрації: `Зареєстрований з ...`.
     - Кнопка "Вийти": `text-red-400 hover:text-red-300`, іконка `LogOut`.
  4. **Order History секція:**
     - Заголовок: "Мої замовлення".
     - Компонент `OrderHistory`.
  5. **Desktop (md+):** grid `md:grid-cols-[280px_1fr]` — info зліва (sticky), orders справа.

### Крок 5 — Підключити маршрут

- **Файл:** `frontend/src/routes/AppRoutes.tsx` (update).
- Замінити placeholder ProfilePage на реальний компонент.
- Маршрут `/profile` → `ProtectedRoute` → `ProfilePage`.

**Файли для створення/змін:**

| Файл | Дія |
| --- | --- |
| `frontend/src/types/order.ts` | **create** |
| `frontend/src/components/OrderHistory.tsx` | **create** |
| `frontend/src/pages/ProfilePage.tsx` | **create** |
| `frontend/src/services/orderService.ts` | update |
| `frontend/src/routes/AppRoutes.tsx` | update |

**Критерії приймання:**

- ProfilePage відображає ім'я, email, роль, дату реєстрації.
- Кнопка "Вийти" очищає auth state і redirectить на `/`.
- OrderHistory завантажує і відображає замовлення юзера.
- Loading/empty/error стани оброблені.
- Status badges з правильними кольорами (pending/confirmed/shipped/completed).
- Expand/collapse деталей замовлення працює.
- Деталі показують список товарів, суму, спосіб доставки/оплати.
- ProtectedRoute: redirect на /login якщо не авторизований.
- BottomNavigation Profile tab працює.
- formatPrice використовується для цін.
- Mobile-first: одна колонка, desktop — sidebar + content.
- Breadcrumbs: "Головна > Профіль".
- Немає `any`, TypeScript strict.

---

## 30) Task #23 ✅ — Admin CRUD для товарів

**Назва:** Створити адмін-панель для керування каталогом товарів з ролевим захистом

**Бекграунд (Блок E — Auth/Profile/Admin, фінальний таск):**

П'ятий і **останній** крок Блоку E. Auth працює, профіль є, замовлення прив'язані до юзерів. Зараз CRUD-форми для товарів (`AddProductForm`, `EditProductModal`, `DeleteButton`) живуть на Home сторінці — доступні **будь-кому** без авторизації. Це потрібно виправити:
1. Перенести CRUD за admin-only доступ.
2. Захистити backend ендпоінти (POST/PUT/DELETE /cards) middleware.
3. Створити виділену адмін-панель.

Після цього таску **Блок E (Auth/Profile/Admin) повністю закритий**.

**Логіка (чому це робимо):**

- **Розмежування ролей** — ключовий принцип безпеки. Звичайний юзер не повинен мати можливості додавати/видаляти товари. Це привілей адміна.
- **adminMiddleware** — серверна перевірка ролі. Навіть якщо хтось обійде фронтенд (curl, Postman) — бекенд відхилить запит з `403 Forbidden`. Ніколи не покладайся тільки на фронтенд для безпеки.
- **AdminRoute** — фронтенд guard. Якщо юзер не admin → redirect з повідомленням. Це UX-захист (не показувати недоступний UI), а не security (бекенд — справжній захист).
- **Home page cleanup** — Home сторінка стає landing page для відвідувачів. CRUD-компоненти переносяться на `/admin`. Home буде базою для hero section, featured products, categories (пізніший етап).

**Scope:**

- Створити `adminMiddleware` на бекенді.
- Захистити `POST/PUT/DELETE /cards` через authMiddleware + adminMiddleware.
- Створити `AdminRoute` компонент (фронтенд guard для admin ролі).
- Створити `AdminPage` (`/admin`) з управлінням товарами.
- Перенести `AddProductForm`, `EditProductModal`, `DeleteButton` на AdminPage.
- Очистити Home сторінку від CRUD-компонентів.
- Додати лінк на /admin у Header/навігації (тільки для admin).
- **НЕ** робимо admin dashboard (статистика, графіки) — post-MVP.
- **НЕ** робимо CRUD для категорій окремо — поки що category це поле товару.
- **НЕ** робимо bulk operations (масове видалення) — post-MVP.
- **НЕ** робимо image upload (поки URL) — post-MVP.

**Що зробити (покроково):**

### Крок 1 — Створити `adminMiddleware`

- **Файл:** `backend/src/middleware/adminMiddleware.ts` (create).
- **Логіка:**
  1. Перевіряє `req.user` (має бути встановлений authMiddleware, який йде першим у chain).
  2. Перевіряє `req.user.role === 'admin'`.
  3. Якщо ні → `403 Forbidden { message: "Доступ заборонено. Потрібна роль адміністратора." }`.
  4. Якщо так → `next()`.
- **Чому окремий від authMiddleware?** SRP: auth перевіряє ідентичність (хто ти?), admin перевіряє дозвіл (що тобі дозволено?). В chain: `authMiddleware → adminMiddleware → handler`.

### Крок 2 — Захистити card endpoints

- **Файл:** `backend/src/routes/cards.ts` (update).
- Підключити middleware до мутаційних ендпоінтів:
  - `POST /cards` → `[authMiddleware, adminMiddleware]`.
  - `PUT /cards/:id` → `[authMiddleware, adminMiddleware]`.
  - `DELETE /cards/:id` → `[authMiddleware, adminMiddleware]`.
- **GET /cards** і **GET /cards/:id** — залишити публічними (всі юзери переглядають каталог).
- Імпортувати middleware: `import { authMiddleware } from "../middleware/authMiddleware"` та `import { adminMiddleware } from "../middleware/adminMiddleware"`.

### Крок 3 — Створити `AdminRoute`

- **Файл:** `frontend/src/components/AdminRoute.tsx` (create).
- **Логіка:**
  1. Якщо `isLoading` → spinner.
  2. Якщо `!isAuthenticated` → redirect на `/login`.
  3. Якщо `user.role !== 'admin'` → redirect на `/` (або показати "Доступ заборонено").
  4. Якщо admin → рендерити children/Outlet.
- **Чому окремий від ProtectedRoute?** Різна логіка redirect і різне повідомлення. ProtectedRoute пускає всіх авторизованих, AdminRoute — тільки адмінів.

### Крок 4 — Створити `AdminPage`

- **Файл:** `frontend/src/pages/AdminPage.tsx` (create).
- **Маршрут:** `/admin` (AdminRoute).
- **Layout:**
  1. **Заголовок:** "Адмін-панель" + badge "Адміністратор".
  2. **Toolbar:** кнопка "Додати товар" (відкриває форму/модалку), пошук по товарах.
  3. **Список товарів:** таблиця або grid з колонками: ID, зображення, назва, ціна, категорія, наявність, дії (редагувати/видалити).
  4. **Дії:** кнопки "Редагувати" (відкриває `EditProductModal`) і "Видалити" (підтвердження + `DELETE /cards/:id`).
  5. **Додавання:** `AddProductForm` або модалка з формою додавання.
- **Важливо:** перевикористовуємо існуючі компоненти (`AddProductForm`, `EditProductModal`, `DeleteButton`) — НЕ переписуємо з нуля. Можливо знадобиться адаптація пропсів.
- **Завантаження даних:** `fetchCards()` → відображення у таблиці. Після CRUD-операції — `reload`.
- **Mobile-first:** на мобілці — картки замість таблиці. На desktop — таблиця.

### Крок 5 — Очистити Home сторінку

- **Файл:** `frontend/src/pages/Home.tsx` (update).
- Видалити `AddProductForm` і `ProductCard` з CRUD-кнопками.
- Замінити на: просте повідомлення "Ласкаво просимо до BOTANO SHOP" + кнопка "Перейти до каталогу".
- Або залишити featured products grid без CRUD-кнопок (показуємо товари, але без редагування).
- Home стане базою для майбутнього hero section, featured products, newsletter (Етап наступного розвитку).

### Крок 6 — Додати маршрут `/admin`

- **Файл:** `frontend/src/routes/AppRoutes.tsx` (update).
- Додати: `{ path: "admin", element: <AdminRoute><AdminPage /></AdminRoute> }`.

### Крок 7 — Додати навігацію на /admin

- **Файл:** `frontend/src/layouts/Header.tsx` (update).
- Якщо `user?.role === 'admin'` → показати додатковий лінк/іконку "Адмін" (наприклад, іконка `Shield` або `Settings`) поруч з Profile.
- Тільки для admin — звичайні юзери не бачать.

**Файли для створення/змін:**

| Файл | Дія |
| --- | --- |
| `backend/src/middleware/adminMiddleware.ts` | **create** |
| `frontend/src/components/AdminRoute.tsx` | **create** |
| `frontend/src/pages/AdminPage.tsx` | **create** |
| `backend/src/routes/cards.ts` | update |
| `frontend/src/pages/Home.tsx` | update |
| `frontend/src/routes/AppRoutes.tsx` | update |
| `frontend/src/layouts/Header.tsx` | update |

**Критерії приймання:**

- `POST/PUT/DELETE /cards` без token → `401`.
- `POST/PUT/DELETE /cards` з token юзера (role=user) → `403`.
- `POST/PUT/DELETE /cards` з token адміна (role=admin) → працює як раніше.
- `GET /cards` і `GET /cards/:id` залишаються публічними.
- `/admin` доступний тільки для admin ролі.
- Не-admin юзер на `/admin` → redirect з повідомленням.
- Не-авторизований на `/admin` → redirect на `/login`.
- AdminPage: список товарів, додавання, редагування, видалення працюють.
- Home сторінка очищена від CRUD-форм.
- Лінк на /admin видно тільки admin юзерам у Header.
- Existing AddProductForm, EditProductModal, DeleteButton перевикористані (не дубльовані).
- Mobile-first admin layout.
- Немає `any`, TypeScript strict.

Виконано. Створено `adminMiddleware` (403 для не-адмінів). POST/PUT/DELETE /cards захищені `authMiddleware → adminMiddleware`. Створено `AdminRoute` (фронтенд guard: гість → /login, user → /, admin → AdminPage). Створено `AdminPage` (`/admin`) з responsive таблицею (desktop) / картками (mobile), inline формою додавання, EditProductModal, DeleteButton. `Home.tsx` очищена від CRUD — тепер landing page з CTA. Лінк `Shield` у Header тільки для admin role.

**Блок E (Auth/Profile/Admin) повністю закритий. Наступний етап — Блок F (Quality): рефакторинг, усунення `any`, централізований error handling, базові тести.**
