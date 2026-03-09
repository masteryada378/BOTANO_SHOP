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

**Назва:** Додати висувну панель фільтрів (Filter Drawer) у каталог

**Бекграунд (Блок C — Catalog & Product, пункт 13 з бэклогу):**

Третій крок Блоку C. Каталог вже має grid, toolbar із сортуванням і кнопку "Фільтри" (тригер з Task #12). Тепер потрібно створити **сам drawer** — висувну панель з фільтрами, яка відкривається при натисканні цієї кнопки.

Після цього таску залишиться:

- Task #14: маршрут `product/:id` і сторінка `ProductDetail`.
- Task #15: breadcrumbs для catalog/product.

**Логіка (чому це робимо):**

- **Filter Drawer** — стандартний патерн мобільних каталогів (Rozetka, Amazon, Zara). Фільтри на мобілці не поміщаються у sidebar, тому ховаються у висувну панель (drawer), яка з'їжджає зліва/знизу. На desktop (md+) фільтри можуть бути sidebar, але зараз фокус — mobile-first drawer.
- **Фільтр за ціною (Price Range)** — найважливіший фільтр для магазину. Юзер хоче бачити товари "від 100 до 500 грн". Потрібно два input-поля (min/max), без кастомного range slider — це складний компонент, який можна додати пізніше.
- **Фільтр за категорією** — зараз модель `Card` не має поля `category`. Потрібно **розширити схему БД** і типи. Це фундаментальний крок для всього магазину — категорії потрібні і на головній, і в навігації, і в breadcrumbs.
- **URL-синхронізація фільтрів** — як і сортування, фільтри зберігаються в URL (`/catalog?sort=price_asc&min_price=100&category=comics`). Це дозволяє ділитися посиланням з конкретною фільтрацією, зберігати стан при F5, і працювати з кнопкою "Назад" у браузері.
- **Backend фільтрація** — фільтри мають працювати на сервері (а не клієнті), бо при великій кількості товарів тягнути все на фронт нераціонально. `GET /cards` отримує нові query params і будує динамічний `WHERE`.

**Scope:**

- Розширити таблицю `cards`: додати колонку `category` (VARCHAR).
- Backend: підтримка `?min_price=`, `?max_price=`, `?category=` у `GET /cards`.
- Frontend: компонент `FilterDrawer` (висувна панель з фільтрами).
- Інтеграція drawer з `CatalogPage` через стан `isFilterOpen`.
- URL-синхронізація фільтрів через `useSearchParams`.
- Кнопка "Застосувати" у drawer закриває його і оновлює товари.
- Кнопка "Скинути" очищає всі фільтри.
- **НЕ** робимо кастомний range slider (поки два звичайних input).
- **НЕ** робимо desktop sidebar з фільтрами (окремий таск, якщо потрібно).
- **НЕ** робимо фільтр за наявністю (поки немає поля `in_stock`).

**Що зробити (покроково):**

### Крок 1 — Розширити схему БД: додати `category` до `cards`

- **Файл:** `backend/src/database.ts` або SQL-міграція (окремий файл `backend/src/migrations/` або inline в `database.ts`).
- Додай колонку `category` до таблиці `cards`:
- **Чому `DEFAULT NULL`?** Існуючі товари не мають категорії — вони мають працювати без помилок. NULL означає "без категорії".
- **Варіант реалізації:** можна додати auto-migration при старті сервера (перевірка через `SHOW COLUMNS FROM cards LIKE 'category'` і виконання ALTER якщо колонки немає). Або виконати SQL вручну один раз через Docker exec.
- **Рекомендація:** Зроби простий migration-script або додай перевірку в `database.ts` при підключенні. Для навчального проєкту auto-migration при старті — прийнятний підхід.

### Крок 2 — Оновити типи `Card`

- **Файл:** `frontend/src/types/Card.ts` (update).
- Додай `category?: string | null` до інтерфейсу `Card`.
- **Файл:** `frontend/src/types/catalog.ts` (update).
- Додай тип фільтрів:
- Додай масив категорій (поки хардкод, пізніше можна тягнути з API):

### Крок 3 — Розширити backend: підтримка фільтрів у `GET /cards`

- **Файл:** `backend/src/routes/cards.ts` (update).
- Додай підтримку query-параметрів `?min_price=`, `?max_price=`, `?category=` до існуючого `GET /cards`.
- **Логіка побудови WHERE:** Динамічно додавай умови до масиву `conditions` та `params`:
- **Валідація `min_price`/`max_price`:** перевіряй що це числа (`isNaN(Number(val))` → ігноруй). Не підставляй сирий string у числове порівняння.
- **Сумісність:** фільтри працюють разом з `?q=` і `?sort=`. Наприклад: `?q=marvel&sort=price_asc&min_price=100&category=comics`.

### Крок 4 — Оновити `cardService.ts`: передача фільтрів

- **Файл:** `frontend/src/services/cardService.ts` (update).
- Оновити `fetchCards()` — прийняти об'єкт параметрів замість окремого `sort`:
- **Чому об'єкт?** З ростом кількості параметрів окремі аргументи стають некерованими. Об'єкт масштабується краще і читається зрозуміліше.

### Крок 5 — Створити компонент `FilterDrawer`

- **Файл:** `frontend/src/components/FilterDrawer.tsx` (create).
- **Props:**
- **UI-структура (mobile-first):**
  1. **Overlay:** напівпрозорий фон за drawer (`bg-black/50`), клік по ньому закриває drawer.
  2. **Drawer панель:** з'їжджає справа (`translate-x` анімація через Tailwind `transition-transform`), `w-80 max-w-[85vw]`, `bg-gray-900`, `h-full`, `overflow-y-auto`.
  3. **Header drawer:** "Фільтри" + кнопка закриття (іконка `X` з `lucide-react`).
  4. **Секція "Ціна":**
    - Два input-поля: "Від" (min) і "До" (max).
    - `type="number"`, `min="0"`, `placeholder="0"` / `placeholder="99999"`.
    - Стилі input: `bg-gray-800 border-gray-700 rounded-lg text-white`.
  5. **Секція "Категорія":**
    - Список чекбоксів або radio-кнопок з масиву `CATEGORIES`.
    - Поки **одна категорія** (radio), бо backend фільтрує по `category = ?`, а не `IN (...)`.
  6. **Footer drawer (sticky внизу):**
    - Кнопка "Застосувати" (`bg-violet-600 hover:bg-violet-700`, `w-full`).
    - Кнопка "Скинути" (`text-gray-400 hover:text-white`, під "Застосувати").
- **Поведінка:**
  - Drawer має **локальний стан** фільтрів (не оновлює URL при кожній зміні input). Тільки при натисканні "Застосувати" — викликається `onApply(localFilters)`.
  - "Скинути" — очищає локальний стан і викликає `onApply({})`.
  - `Escape` закриває drawer.
  - **Focus trap** бажаний, але не обов'язковий зараз.
- **Анімація:** `transition-transform duration-300 ease-in-out`. Коли `isOpen` — `translate-x-0`, інакше `translate-x-full`.
- **Body scroll lock:** коли drawer відкритий, бажано заблокувати скрол body (`overflow-hidden` на `<body>`). Використай `useEffect` в drawer або в `CatalogPage`.

### Крок 6 — Інтегрувати `FilterDrawer` у `CatalogPage`

- **Файл:** `frontend/src/pages/Catalog.tsx` (update).
- **Стан:** `const [isFilterOpen, setIsFilterOpen] = useState(false);`
- **URL-синхронізація фільтрів:**
  - Зчитати фільтри з URL: `searchParams.get("min_price")`, `searchParams.get("max_price")`, `searchParams.get("category")`.
  - При `onApply` — оновити `searchParams` (зберігаючи існуючий `sort`):
- **Передай фільтри у `fetchCards()`:**
  - `useEffect` залежить від `currentSort`, `min_price`, `max_price`, `category`.
  - `fetchCards({ sort: currentSort, min_price, max_price, category })`.
- **Підключи тригер:** замінити `console.log` у `onFilterClick` на `setIsFilterOpen(true)`.
- **Рендер `FilterDrawer`:** додати в JSX `CatalogPage`.
- **Активні фільтри badge:** опціонально — показати кількість активних фільтрів біля кнопки "Фільтри" у toolbar (наприклад, `Фільтри (2)`). Реалізуй через підрахунок непустих значень у фільтрах.

**Файли для створення/змін:**


| Файл                                       | Дія        |
| ------------------------------------------ | ---------- |
| `frontend/src/components/FilterDrawer.tsx` | **create** |
| `frontend/src/types/catalog.ts`            | update     |
| `frontend/src/types/Card.ts`               | update     |
| `backend/src/routes/cards.ts`              | update     |
| `frontend/src/services/cardService.ts`     | update     |
| `frontend/src/pages/Catalog.tsx`           | update     |
| `backend/src/database.ts` (або migration)  | update     |


**Критерії приймання:**

- `GET /cards?min_price=100&max_price=500` повертає товари в діапазоні цін.
- `GET /cards?category=comics` повертає товари з категорією "comics".
- Фільтри працюють разом з `?q=` та `?sort=`.
- Невалідні значення `min_price`/`max_price` (наприклад, "abc") ігноруються без помилки.
- Кнопка "Фільтри" у toolbar відкриває drawer справа.
- Drawer має overlay, анімацію появи, кнопку закриття і Escape.
- Секція "Ціна": два input (від/до) типу number.
- Секція "Категорія": radio-кнопки з `CATEGORIES`.
- "Застосувати" закриває drawer, оновлює URL і перезавантажує товари.
- "Скинути" очищає фільтри, оновлює URL і перезавантажує товари.
- При F5 з `?min_price=100&category=comics` — фільтри відновлюються у drawer.
- Фільтри зберігають `sort` в URL (не скидають сортування).
- Body scroll заблокований коли drawer відкритий.
- Таблиця `cards` має колонку `category` (VARCHAR, nullable).
- `Card` тип оновлений: `category?: string | null`.
- Немає `any`, TypeScript strict.

---

## 21) Task #14 ✅ — Сторінка товару (Product Detail Page)

**Назва:** Створити маршрут `product/:id` і сторінку `ProductDetail`

**Бекграунд (Блок C — Catalog & Product, пункт 14 з бэклогу):**

Четвертий крок Блоку C. Каталог показує товари у grid і дозволяє їх сортувати/фільтрувати. Але при натисканні на картку товару — нікуди не веде. Потрібна **окрема сторінка товару**, де юзер бачить повну інформацію, галерею зображень, ціну, опис і може додати товар у кошик.

Після цього таску залишиться:

- Task #15: breadcrumbs для catalog/product (останній крок Блоку C).

**Логіка (чому це робимо):**

- **Product Detail Page (PDP)** — ключова сторінка e-commerce. Саме тут юзер приймає рішення "купувати чи ні". Без PDP магазин — просто список карток без контексту.
- **Backend `GET /cards/:id**` — зараз є PUT і DELETE для `:id`, але немає GET. Потрібен окремий endpoint для отримання одного товару.
- **Розширення моделі** — для повноцінного PDP потрібно більше полів: `description`, `brand`, `old_price` (для знижок), `in_stock`. Додаємо їх до таблиці `cards`.
- **Image Gallery** — поки товар має одне `image`. Повноцінна галерея з кількома зображеннями — це окремий таск (зв'язок many-to-one з окремою таблицею). Зараз зробимо простий варіант з одним зображенням і placeholder для галереї.
- **SEO:** Сторінка товару — найважливіша для SEO. Правильний `<title>`, мета-теги, семантичні заголовки.

**Scope:**

- Розширити таблицю `cards`: додати `description` (TEXT), `brand` (VARCHAR), `old_price` (DECIMAL, nullable), `in_stock` (BOOLEAN, default TRUE).
- Backend: додати `GET /cards/:id`.
- Frontend: маршрут `/product/:id`, сторінка `ProductDetail`.
- Відображення: зображення, назва, бренд, ціна/стара ціна, статус наявності, опис.
- Кнопки "Додати в кошик" і "В обране" (wishlist поки `console.log`).
- Зв'язок з каталогом: `CatalogCard` і `SearchSuggestions` ведуть на `/product/:id` при натисканні.
- **НЕ** робимо табовий інтерфейс (опис/характеристики/відгуки) — буде пізніше.
- **НЕ** робимо галерею з кількома фото (одне зображення поки).
- **НЕ** робимо вибір атрибутів (розмір, колір) — буде пізніше.

**Що зробити (покроково):**

### Крок 1 — Розширити схему БД

- Додати колонки до `cards`:
- **Чому окремі ALTER?** Якщо якась колонка вже існує (наприклад, `category` з Task #13), окремі запити дозволяють обробити помилку для однієї колонки без блокування інших.
- Оновити auto-migration логіку (якщо створена в Task #13) або виконати вручну.

### Крок 2 — Оновити тип `Card`

- **Файл:** `frontend/src/types/Card.ts` (update).
- Додати поля:

### Крок 3 — Додати backend endpoint `GET /cards/:id`

- **Файл:** `backend/src/routes/cards.ts` (update).
- Додай новий route **перед** `PUT /cards/:id`:
- **Чому 404?** Якщо товару з таким id не існує — правильна HTTP-семантика. Frontend може показати "Товар не знайдено" замість порожньої сторінки.
- **Типізація:** Створи серверний тип `Card` або використай `RowDataPacket` з mysql2. Уникай `any`.

### Крок 4 — Оновити `cardService.ts`: додати `fetchCardById()`

- **Файл:** `frontend/src/services/cardService.ts` (update).
- Додай функцію:

### Крок 5 — Створити сторінку `ProductDetail`

- **Файл:** `frontend/src/pages/ProductDetail.tsx` (create).
- **Структура:**
  1. **Завантаження:** використай `useParams<{ id: string }>()` з react-router-dom.
  2. **Стан:** `product`, `isLoading`, `error`.
  3. *`*useEffect`:** при зміні `id` — `fetchCardById(id)`.
  4. **Layout (mobile-first, вертикальний):**
    - **Зображення** (top): `aspect-square`, `rounded-xl`, `bg-gray-800` з placeholder якщо `image` відсутній. `object-cover`. На desktop — зображення зліва, інфо справа (grid `md:grid-cols-2`).
    - **Product Info (під зображенням):**
      - Бренд: `text-sm text-violet-400 uppercase tracking-wider`.
      - Назва: `text-2xl font-bold text-white`.
      - Ціна: `text-3xl font-bold text-emerald-400` (використай `JetBrains Mono` якщо підключено).
      - Стара ціна (якщо є `old_price`): перекреслена `line-through text-gray-500` поруч з основною.
      - Знижка badge: якщо `old_price` > `price` — показати `"-{відсоток}%"` badge (`bg-red-500 text-white rounded-full px-2 py-0.5 text-xs`).
      - Статус наявності: `in_stock ? "В наявності" : "Немає в наявності"`. Зелений/червоний відповідно.
    - **Action Buttons:**
      - "Додати в кошик" — `bg-violet-600 hover:bg-violet-700 w-full py-3 rounded-xl text-lg font-semibold`. Використовує `addToCart` з `AppContext`. Якщо `!in_stock` — кнопка `disabled`, `opacity-50`.
      - "В обране" — іконка `Heart` з `lucide-react`, secondary стиль. `onClick={() => console.log("TODO: wishlist")}`.
    - **Опис:** `text-gray-300`, якщо є `description`. Якщо немає — не рендерити секцію.
  5. **Loading state:** скелетони для зображення та тексту (аналогічно `CatalogPage`).
  6. **Error state:** "Товар не знайдено" з кнопкою "Повернутися до каталогу" (Link на `/catalog`).
- **Семантика (SEO):**
  - `<article>` для контейнера товару.
  - `<h1>` для назви товару.
  - `<img alt={product.title}>`.

### Крок 6 — Додати маршрут і зв'язати навігацію

- **Файл:** `frontend/src/routes/AppRoutes.tsx` (update).
- Додати: `<Route path="/product/:id" element={<ProductDetail />} />`.
- **Файл:** `frontend/src/components/CatalogCard.tsx` (update).
- Обгорнути картку у `<Link to={`/product/${card.id}`}>` (або зробити клік по картці навігацією через `useNavigate`). Кнопка "В кошик" **не** має тригерити навігацію — `e.stopPropagation()`.
- **Файл:** `frontend/src/components/SearchSuggestions.tsx` (update).
- При кліку на suggestion — навігація на `/product/${id}` замість (або разом з) поточної поведінки.

**Файли для створення/змін:**


| Файл                                            | Дія        |
| ----------------------------------------------- | ---------- |
| `frontend/src/pages/ProductDetail.tsx`          | **create** |
| `frontend/src/types/Card.ts`                    | update     |
| `backend/src/routes/cards.ts`                   | update     |
| `frontend/src/services/cardService.ts`          | update     |
| `frontend/src/routes/AppRoutes.tsx`             | update     |
| `frontend/src/components/CatalogCard.tsx`       | update     |
| `frontend/src/components/SearchSuggestions.tsx` | update     |
| `backend/src/database.ts` (або migration)       | update     |


**Критерії приймання:**

- `GET /cards/1` повертає один товар з усіма полями (включно з `description`, `brand`, `old_price`, `in_stock`).
- `GET /cards/99999` повертає 404 з повідомленням.
- Маршрут `/product/:id` працює, сторінка рендериться.
- Зображення товару відображається (або placeholder при відсутності).
- Назва, бренд, ціна, стара ціна, знижка badge, статус наявності — відображаються коректно.
- Кнопка "Додати в кошик" додає товар у `AppContext.cart`. Disabled якщо `!in_stock`.
- Кнопка "В обране" присутня (функціональність — `console.log` поки).
- Опис товару відображається, якщо є.
- Клік по `CatalogCard` веде на `/product/:id`. Кнопка "В кошик" на картці **не** тригерить навігацію.
- Клік по suggestion у пошуку веде на `/product/:id`.
- Loading стан: скелетони при завантаженні.
- Error стан: "Товар не знайдено" з посиланням на каталог.
- Mobile-first: вертикальний layout на мобілці, 2 колонки на desktop (md+).
- Семантичний HTML: `<article>`, `<h1>`, `alt` на зображенні.
- Таблиця `cards` має нові колонки: `description`, `brand`, `old_price`, `in_stock`.
- Немає `any`, TypeScript strict.

---

## 22) Task #15 ✅ — Breadcrumbs для каталогу та сторінки товару

Виконано. Створено `BreadcrumbItem` тип у `catalog.ts`. Компонент `Breadcrumbs` (`<nav>` + `<ol>`, `ChevronRight`-роздільник, `aria-current="page"` на останній крихті, іконка Home для першого елемента, `truncate` для довгих назв). Підключено до `CatalogPage` (динамічна третя крихта при активній категорії) та `ProductDetail` (скелетон під час loading, breadcrumbs після завантаження). Блок C (Catalog & Product) повністю закрито.

---

**Назва:** Створити компонент `Breadcrumbs` і підключити до Catalog та ProductDetail

**Бекграунд (Блок C — Catalog & Product, пункт 15 з бэклогу):**

П'ятий і **останній** крок Блоку C. Каталог і сторінка товару вже працюють, але юзер не розуміє "де я зараз?" у структурі сайту. Breadcrumbs ("хлібні крихти") — це навігаційний шлях, який показує ієрархію (наприклад: `Головна > Каталог > Marvel > Spider-Man Figure`).

Після цього таску **Блок C (Catalog & Product) буде повністю закритий**. Наступний крок — Блок D (Cart & Checkout).

**Логіка (чому це робимо):**

- **Навігаційний контекст** — без breadcrumbs юзер на сторінці товару не знає як повернутися до каталогу (окрім кнопки "Назад" у браузері). Breadcrumbs — стандарт e-commerce UX.
- **SEO** — Google використовує breadcrumbs для rich snippets у пошуковій видачі. Семантична розмітка (`<nav aria-label="breadcrumb">`, `<ol>`) покращує індексацію.
- **Structured data** — опціонально можна додати JSON-LD для breadcrumbs, але це не обов'язково зараз.
- **Повторне використання** — один компонент `Breadcrumbs` для всіх сторінок. Він приймає масив "крихт" і рендерить їх з роздільниками.

**Scope:**

- Створити універсальний компонент `Breadcrumbs`.
- Підключити до `CatalogPage` (Головна > Каталог).
- Підключити до `ProductDetail` (Головна > Каталог > Назва товару).
- Семантична розмітка: `<nav>`, `<ol>`, `<li>`, `aria-label`, `aria-current="page"`.
- **НЕ** робимо JSON-LD structured data (можна додати пізніше).
- **НЕ** робимо динамічну категорію в breadcrumbs (наприклад, "Головна > Комікси > Товар") — поки тільки "Каталог" як проміжний рівень.

**Що зробити (покроково):**

### Крок 1 — Створити тип `BreadcrumbItem`

- **Файл:** `frontend/src/types/catalog.ts` (update).
- Додай:

### Крок 2 — Створити компонент `Breadcrumbs`

- **Файл:** `frontend/src/components/Breadcrumbs.tsx` (create).
- **Props:**
- **Структура:**
- **Роздільник:** `ChevronRight` з `lucide-react` (або символ `/`, `>`). Chevron — сучасніший вигляд.
- **Останній елемент:** не є посиланням (поточна сторінка), має `aria-current="page"`, інший колір.
- **Truncation:** назва товару може бути довгою — `truncate max-w-[200px]` на мобілці.
- **Перший елемент завжди "Головна"** (з іконкою `Home` з lucide-react, опціонально).

### Крок 3 — Підключити `Breadcrumbs` до `CatalogPage`

- **Файл:** `frontend/src/pages/Catalog.tsx` (update).
- Додай `Breadcrumbs` над toolbar:
- Якщо є активний фільтр за категорією — можна додати третю крихту:

### Крок 4 — Підключити `Breadcrumbs` до `ProductDetail`

- **Файл:** `frontend/src/pages/ProductDetail.tsx` (update).
- Додай `Breadcrumbs` над зображенням товару:
- **Важливо:** breadcrumbs рендеряться **тільки коли товар завантажений** (не під час loading). Або показати скелетон для breadcrumbs.

**Файли для створення/змін:**


| Файл                                      | Дія        |
| ----------------------------------------- | ---------- |
| `frontend/src/components/Breadcrumbs.tsx` | **create** |
| `frontend/src/types/catalog.ts`           | update     |
| `frontend/src/pages/Catalog.tsx`          | update     |
| `frontend/src/pages/ProductDetail.tsx`    | update     |


**Критерії приймання:**

- Компонент `Breadcrumbs` приймає масив `BreadcrumbItem[]` і рендерить ланцюжок посилань.
- Роздільник між елементами — `ChevronRight` (або інша іконка/символ).
- Останній елемент — не посилання, має `aria-current="page"`.
- `CatalogPage`: breadcrumbs "Головна > Каталог" відображаються над toolbar.
- `ProductDetail`: breadcrumbs "Головна > Каталог > Назва товару" відображаються над контентом.
- Посилання в breadcrumbs працюють (навігація без перезавантаження сторінки).
- Довга назва товару обрізається з `...` (truncate).
- Семантична розмітка: `<nav aria-label="...">`, `<ol>`, `<li>`.
- Mobile-first: компактний розмір тексту, gap між елементами.
- Немає `any`, TypeScript strict.

---

**Після завершення Tasks #13–#15 Блок C (Catalog & Product) повністю закритий. Наступний етап — Блок D (Cart & Checkout): Tasks #16–#19.**