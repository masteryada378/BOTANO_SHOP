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

2. Home Page (Головна сторінка)

- Hero Section: Динамічний банер (Slider) з акційними товарами (наприклад, нові фігурки Funko Pop або лімітовані комікси).
- Categories: Горизонтальний список категорій у вигляді іконок або карток (Marvel, Star Wars, DC тощо).
- Featured/Top Sellers: Сітка товарів (Grid) з основними картками:
    - Зображення, назва, ціна, кнопка "Додати в кошик" (Quick add).
- Newsletter: Блок підписки на новини "для своїх".

3. Products Page (Каталог)

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

4. Product Detail Page (Сторінка товару)

- Image Gallery: Слайдер із зображеннями товару з можливістю збільшення (Zoom).
- Product Info:
    - Назва товару та бренд.
    - Ціна (та стара ціна, якщо є знижка).
    - Статус наявності (В наявності / Під замовлення).
- Product Configuration: Вибір атрибутів (розмір футболки, версія видання).
- Action Buttons: Кнопки "Купити" та "Додати в список бажаного".
- Descriptions & Tabs: Опис товару, характеристики, відгуки користувачів.

5. Admin (Адмін-панель)

- Каталог товарів: Додавання/редагування товарів, описів, цін, фотографій, категорій та характеристик.

6. Cart & Checkout (Кошик та Оформлення)

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

7. User Profile (Кабінет користувача)

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

- [x] Layout: Header + BottomNav + Footer
- [ ] Catalog з mobile filters + sorting
- [ ] Product Detail
- [ ] Cart
- [ ] Checkout
- [ ] Auth (Login/Register)
- [ ] Profile (мінімум: історія замовлень)
- [ ] Admin CRUD товарів

---

## 6) Атомарний backlog (по одному завданню)

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

## 19) Task #12 — Toolbar для каталогу: лічильник, сортування, тригер фільтрів

**Назва:** Додати панель інструментів (toolbar) над grid каталогу

**Бекграунд (Блок C — Catalog & Product, пункт 12 з бэклогу):**

Другий крок Блоку C. Каталог вже показує товари у grid, але **без жодних інструментів** — юзер не може ні сортувати, ні бачити скільки товарів знайдено, ні запустити фільтри. Toolbar — це "панель керування" каталогом.

Після цього таску залишиться:
- Task #13: mobile filter drawer (сам drawer з фільтрами).
- Task #14: ProductDetail page.
- Task #15: breadcrumbs.

**Логіка (чому це робимо):**

- **Лічильник результатів** — базовий UX-елемент: юзер має розуміти "скільки товарів є" (наприклад, "24 товари"). Без цього каталог виглядає як нескінченна невідома стіна.
- **Сортування** — другий за важливістю інструмент після пошуку. "Від дешевих до дорогих" — найчастіший сценарій у будь-якому магазині (Rozetka, Amazon, тощо). Без сортування юзер вимушений скролити хаотичний список.
- **Кнопка "Фільтри"** — поки лише **тригер** (кнопка, яка в Task #13 відкриватиме drawer). Зараз вона буде візуально присутня, але при натисканні нічого не робитиме (або покаже `console.log`). Чому не відкладати? Бо toolbar без кнопки фільтрів виглядає неповним, а додати кнопку зараз — 2 хвилини, а не окремий таск.
- **Backend sorting** — зараз `GET /cards` завжди повертає `ORDER BY id DESC`. Для сортування за ціною потрібно передати параметр `?sort=price_asc` або `?sort=price_desc`, і бекенд має вибирати правильний `ORDER BY`.
- **URL-синхронізація (useSearchParams)** — сортування зберігається в URL (`/catalog?sort=price_asc`), щоб при оновленні сторінки або поширенні посилання стан не втрачався. Це стандарт для каталогів.

**Scope (важливо):**

- Toolbar: лічильник результатів, dropdown/select для сортування, кнопка "Фільтри" (тригер без drawer).
- Backend: підтримка `?sort=` у `GET /cards`.
- Frontend: синхронізація сортування з URL через `useSearchParams`.
- **НЕ** робимо filter drawer (Task #13).
- **НЕ** робимо пагінацію (окремий таск).
- **НЕ** робимо breadcrumbs (Task #15).

**Що зробити (покроково):**

### Крок 1 — Розширити backend: підтримка `?sort=`

- **Файл:** `backend/src/routes/cards.ts` (update).
- Додай підтримку query-параметра `?sort=` до існуючого `GET /cards`.
- **Допустимі значення:** `price_asc`, `price_desc`, `newest` (default), `oldest`.
- **Логіка:**
    1. Зчитай параметр: `const sort = typeof req.query.sort === "string" ? req.query.sort : "newest";`
    2. Створи маппінг значень на SQL `ORDER BY`:
        ```
        const ORDER_MAP: Record<string, string> = {
          price_asc: "price ASC",
          price_desc: "price DESC",
          newest: "id DESC",
          oldest: "id ASC",
        };
        ```
    3. Визнач `ORDER BY`: `const orderBy = ORDER_MAP[sort] ?? ORDER_MAP.newest;`
        - **Чому fallback?** Якщо хтось пришле `?sort=hacked_value` — не падаємо, а використовуємо дефолтний сорт. Ніколи не підставляй user input прямо у SQL — тут маппінг захищає від injection.
    4. Підстав `orderBy` у SQL-запит. **ВАЖЛИВО:** `ORDER BY` не можна параметризувати через `?` placeholder (MySQL не підтримує placeholders для ORDER BY clause). Оскільки `orderBy` береться виключно з `ORDER_MAP` (а не з user input напряму), це безпечно.
- **Сумісність з `?q=`:** сортування має працювати разом з пошуком. Якщо передано `?q=marvel&sort=price_asc` — фільтруємо за назвою І сортуємо за ціною.
- **Рефактор запиту:** зараз є два окремих `pool.query()` (з `q` і без). Об'єднай в один шлях з динамічним `WHERE` і `ORDER BY`, щоб не дублювати логіку:
    ```
    let sql = "SELECT * FROM cards";
    const params: string[] = [];

    if (q) {
      sql += " WHERE title LIKE ?";
      params.push(`%${q}%`);
    }

    sql += ` ORDER BY ${orderBy}`;

    if (q) {
      sql += " LIMIT 10";
    }

    const [rows] = await pool.query(sql, params);
    ```

### Крок 2 — Оновити frontend service: передача `sort`

- **Файл:** `frontend/src/services/cardService.ts` (update).
- **Тип сортування** — створи тип у файлі типів або прямо в сервісі:
    ```
    export type SortOption = "newest" | "oldest" | "price_asc" | "price_desc";
    ```
    Краще винести в `frontend/src/types/catalog.ts` (create) — цей тип знадобиться і в компонентах, і в сервісі.
- **Оновити `fetchCards()`** — додай опціональний параметр sort:
    ```
    export const fetchCards = (sort?: SortOption): Promise<Card[]> => {
      const params = new URLSearchParams();
      if (sort) params.set("sort", sort);
      const qs = params.toString();
      return apiGet<Card[]>(qs ? `${RESOURCE}?${qs}` : RESOURCE);
    };
    ```
    **Чому `URLSearchParams`?** Безпечна побудова query string, автоматичне кодування. Також легко додати нові параметри в майбутньому (page, limit, filters) без ручної конкатенації.

### Крок 3 — Створити компонент `CatalogToolbar`

- **Файл:** `frontend/src/components/CatalogToolbar.tsx` (create).
- **Props (інтерфейс):**
    ```
    interface CatalogToolbarProps {
      totalCount: number;       // кількість товарів для відображення лічильника
      currentSort: SortOption;  // поточне значення сортування
      onSortChange: (sort: SortOption) => void;  // колбек при зміні сорту
      onFilterClick: () => void;  // колбек для кнопки "Фільтри"
    }
    ```
- **Структура (горизонтальний рядок):**
    - Layout: `flex items-center justify-between gap-2`, щоб елементи рівномірно розподілились.
    - На мобілці: все в одному рядку, компактно.
    1. **Лічильник результатів (ліворуч):**
        - Текст: `{totalCount} товарів` (або правильна відміна: "1 товар", "2 товари", "5 товарів").
        - Використай допоміжну функцію для відміни (аналогічну `getCartLabelSuffix` з Header, але для "товар/товари/товарів"). Можна винести спільну утиліту `pluralize()` у `frontend/src/lib/pluralize.ts`, або написати inline.
        - Стиль: `text-sm text-gray-400`.
    2. **Dropdown сортування (праворуч):**
        - Реалізуй через нативний `<select>` — простий, доступний, не потребує кастомного dropdown.
        - Опції:
            - "Спочатку нові" → `newest`
            - "Спочатку старі" → `oldest`
            - "Від дешевих" → `price_asc`
            - "Від дорогих" → `price_desc`
        - `value={currentSort}`, `onChange={(e) => onSortChange(e.target.value as SortOption)}`.
        - Стилі: `bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-1.5 text-sm`, `focus:ring-violet-500`.
        - `aria-label="Сортування товарів"`.
    3. **Кнопка "Фільтри" (поруч з сортуванням або під ним на мобілці):**
        - Іконка `SlidersHorizontal` з `lucide-react` + текст "Фільтри".
        - `onClick={onFilterClick}`.
        - Стилі: `bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700`.
        - На desktop (md+) цю кнопку можна **сховати** (`md:hidden`), бо фільтри на desktop будуть у sidebar (не в drawer). Або залишити видимою — залежно від того, як будемо робити desktop filters. Поки **залишай видимою** на всіх розмірах.

### Крок 4 — Інтегрувати toolbar + sorting у `CatalogPage`

- **Файл:** `frontend/src/pages/Catalog.tsx` (update).
- **URL-синхронізація сортування:**
    1. Імпортуй `useSearchParams` з `react-router-dom`.
    2. Зчитай поточний sort з URL: `const [searchParams, setSearchParams] = useSearchParams();`
    3. `const currentSort: SortOption = (searchParams.get("sort") as SortOption) || "newest";`
    4. При зміні сорту: `setSearchParams({ sort: newSort })` — оновлює URL без перезавантаження.
    5. **Валідація:** якщо `searchParams.get("sort")` містить невалідне значення — fallback до `"newest"`. Створи масив допустимих значень і перевіряй через `.includes()`.
- **Передай `currentSort` у `fetchCards()`:**
    - В `useEffect` (або `useCallback`), де завантажуються товари, передай `fetchCards(currentSort)`.
    - `currentSort` має бути у масиві залежностей `useEffect` — при зміні сорту товари перезавантажаться.
- **Розмісти `CatalogToolbar`** між заголовком секції та grid:
    ```
    <CatalogToolbar
      totalCount={products.length}
      currentSort={currentSort}
      onSortChange={(sort) => setSearchParams({ sort })}
      onFilterClick={() => console.log("TODO: open filter drawer")}
    />
    ```
- **Loading state:** при зміні сорту показувати скелетони (бо товари перезавантажуються). `CatalogToolbar` **залишається видимим** під час loading — лічильник може тимчасово показувати "..." або попереднє значення. Не ховай toolbar на час завантаження.

### Крок 5 — Типи каталогу

- **Файл:** `frontend/src/types/catalog.ts` (create).
- Винеси сюди:
    ```
    export type SortOption = "newest" | "oldest" | "price_asc" | "price_desc";

    export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
      { value: "newest", label: "Спочатку нові" },
      { value: "oldest", label: "Спочатку старі" },
      { value: "price_asc", label: "Від дешевих" },
      { value: "price_desc", label: "Від дорогих" },
    ];
    ```
- **Чому окремий файл?** `SortOption` використовується в 3 місцях: тип, сервіс, компонент. Один source of truth.
- **Чому `SORT_OPTIONS` масив?** `<select>` рендерить опції через `.map()`, а масив гарантує порядок (на відміну від об'єкта).

**Файли для створення/змін:**

| Файл | Дія |
|------|-----|
| `frontend/src/types/catalog.ts` | **create** |
| `frontend/src/components/CatalogToolbar.tsx` | **create** |
| `backend/src/routes/cards.ts` | update |
| `frontend/src/services/cardService.ts` | update |
| `frontend/src/pages/Catalog.tsx` | update |

**Критерії приймання:**

- [ ] `GET /cards?sort=price_asc` повертає товари, відсортовані за ціною зростаюче; `price_desc` — спадаюче; `newest` / `oldest` — за id.
- [ ] `?sort=` працює в комбінації з `?q=` (наприклад, `?q=marvel&sort=price_asc`).
- [ ] Невалідне значення `sort` fallback-иться до `newest` (без помилки).
- [ ] Toolbar відображається над grid: лічильник ліворуч, сортування + кнопка фільтрів праворуч.
- [ ] Лічильник показує правильну кількість з правильною відміною ("1 товар", "3 товари", "10 товарів").
- [ ] Зміна сортування у `<select>` оновлює URL (`/catalog?sort=price_desc`) і перезавантажує товари.
- [ ] При оновленні сторінки (F5) з `?sort=price_asc` — сортування зберігається.
- [ ] Кнопка "Фільтри" присутня, при натисканні поки `console.log` (drawer буде в Task #13).
- [ ] Toolbar видимий під час loading (лічильник може бути "..." або 0).
- [ ] `SortOption` і `SORT_OPTIONS` винесені в `types/catalog.ts`.
- [ ] Backend не підставляє user input прямо у SQL — використовується маппінг `ORDER_MAP`.
- [ ] Немає `any`, TypeScript strict.
