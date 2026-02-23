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

## 3) Етапи реалізації + Definition of Done

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

## 4) MVP чеклист (must-have)

- [ ] Layout: Header + BottomNav + Footer
- [ ] Catalog з mobile filters + sorting
- [ ] Product Detail
- [ ] Cart
- [ ] Checkout
- [ ] Auth (Login/Register)
- [ ] Profile (мінімум: історія замовлень)
- [ ] Admin CRUD товарів

---

## 5) Атомарний backlog (по одному завданню)

### Блок A — Foundation

1. Додати `.env.example` для frontend/backend.
2. Винести API URL у frontend env (`VITE_API_URL`) і прибрати хардкод.
3. Додати healthcheck для `db` у `docker-compose.yml`.
4. Додати залежність `backend` від healthy `db`.
5. Оновити `README.md` інструкцією запуску й env.

### Блок B — Layout

6. Додати `BottomNavigation` компонент (mobile-first).
7. Підключити `BottomNavigation` у `Layout`.
8. Переробити cart badge у Header на дані з `AppContext`.
9. Додати базу для live-search (стан + debounce hook).
10. Підключити live suggestions dropdown до Header.

### Блок C — Catalog & Product

11. Створити сторінку `Catalog`.
12. Додати toolbar (count/sort/filter trigger).
13. Додати mobile filter drawer.
14. Додати маршрут `product/:id` і сторінку `ProductDetail`.
15. Підключити breadcrumbs для catalog/product.

### Блок D — Cart & Checkout

16. Розширити модель кошика (`id + quantity + price snapshot`).
17. Реалізувати сторінку `Cart`.
18. Реалізувати сторінку `Checkout` з валідацією.
19. Додати persist кошика в `localStorage`.

### Блок E — Auth/Profile/Admin

20. Додати `Login/Register` сторінки.
21. Додати `AuthContext` + protected routes.
22. Додати `Profile` + `OrderHistory`.
23. Додати backend модулі `auth/orders`.
24. Додати admin CRUD для товарів.

### Блок F — Quality

25. Рефактор backend у `controllers/services/models`.
26. Прибрати `any` у backend API.
27. Додати централізований `errorHandler`.
28. Додати базові тести критичних flow.

---

## 6) Робочий протокол (ти + я)

1. Я видаю **одне** завдання.
2. Ти імплементуєш і показуєш diff/файли.
3. Я роблю code review (типізація, архітектура, мобілка, ризики).
4. Фіксуємо покращення.
5. Даю наступне завдання.

---

## 7) Task #1 ✅ — Env foundation для передбачуваного запуску

Виконано. Створено `backend/.env.example`, `frontend/.env.example`, оновлено `README.md`.

---

## 8) Task #2 ✅ — Прибрати хардкод API URL у frontend

**Назва:** Прибрати хардкод API URL у frontend

**Логіка (чому це робимо):**

- Зараз URL бекенду захардкоджений у коді фронтенду — змінити адресу без рефакторингу неможливо.
- Централізований `api`-клієнт дає єдину точку для baseURL, заголовків та обробки помилок.

**Що зробити:**

1. Знайти всі місця у `frontend/src`, де URL бекенду захардкоджений (наприклад `http://localhost:5005`).
2. Замінити їх на `import.meta.env.VITE_API_URL`.
3. Створити `frontend/src/services/api.ts` — тонка обгортка над `fetch` з `baseURL = import.meta.env.VITE_API_URL`. Тип відповіді — generic `<T>`, без `any`.
4. Перевести існуючі запити до `cards` на використання нового клієнта.

**Файли для створення/змін:**

- `frontend/src/services/api.ts` (create)
- будь-який файл де є хардкод URL (update)

**Критерії приймання:**

- Рядок `localhost:5005` або будь-який хардкод HTTP-адреси відсутній у `frontend/src`.
- `api.ts` типізований без `any`.
- `VITE_API_URL` береться виключно з `import.meta.env`.
- Існуючий функціонал (`cards`) не зламаний.

---

## 9) Task #3 — Healthcheck для MySQL у docker-compose

**Назва:** Додати healthcheck для `db` (MySQL), щоб мати “готовність сервісу”, а не “контейнер стартанув”

**Логіка (чому це робимо):**

- Зараз `depends_on` означає лише порядок старту контейнерів, але **не** гарантує, що MySQL вже приймає з’єднання.
- Healthcheck дає нам формальний сигнал “БД готова”, який потім використаємо (у Task #4) щоб backend стартував тільки після `db: healthy`.
- Це фундамент для стабільної розробки: менше флакі-падінь, менше “пофіксилось після 2-го запуску”.

**Що зробити (дуже конкретно, без самодіяльності):**

1. Відкрий `docker-compose.yml`.
2. Знайди сервіс `db:` (MySQL 8.0).
3. Додай для `db` секцію **healthcheck** з перевіркою, що MySQL відповідає на ping.
    - **Команда перевірки** має бути через `mysqladmin ping`.
    - Використай root-користувача, бо він точно існує в цьому compose (пароль вже заданий в `MYSQL_ROOT_PASSWORD`).
    - Щоб не хардкодити пароль повторно в команді, використай змінну середовища `MYSQL_ROOT_PASSWORD` (Compose/YAML нюанс: для env-розширення в healthcheck зазвичай потрібне екранування через `$$`).
4. Таймінги (постав саме ці значення, щоб не “підганяти під удачу”):
    - `interval`: 10s
    - `timeout`: 5s
    - `retries`: 5
    - `start_period`: 20s (щоб MySQL мав час прогрітись)
5. **Не змінюй** `depends_on` для backend в цьому таску — це буде **Task #4**, щоб ми відловлювали проблеми поетапно.

**Як перевірити (manual verification):**

1. Перезапусти стек (`docker compose up --build`).
2. Переконайся, що у списку сервісів MySQL має статус **healthy** (зазвичай це видно в `docker compose ps`).
3. Якщо MySQL довго лишається `starting/unhealthy`:
    - перевір, чи правильно задані `start_period/interval/retries`;
    - перевір, що healthcheck-команда використовує правильний хост (`localhost`) і root-пароль через env.

**Файли для створення/змін:**

- `docker-compose.yml` (update)

**Критерії приймання:**

- Після запуску `docker compose up` сервіс `db` переходить у стан **healthy** (не просто running).
- Healthcheck не містить дублювання пароля в явному вигляді (використовується env).
- В цьому таску **немає** змін у `backend` і **немає** змін у `depends_on` для backend.
