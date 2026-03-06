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

**Назва:** Базова сторінка каталогу з клієнтськими картками товарів

**Бекграунд (Блок C — Catalog & Product, пункт 11 з бэклогу):**

Це **перший** крок Блоку C і початок **Етапу 2 "Каталог і пошук"**. Ми переходимо від оболонки (Layout) до контенту — сторінки, де користувач переглядає товари для покупки.

Нагадаю DoD Етапу 2:
- Є сторінка каталогу з breadcrumbs, toolbar, sort/filter.
- У мобільній версії фільтри відкриваються в drawer/modal.
- Є пагінація або стабільний infinite scroll.
- Пошук працює через API/дані і не блокує UI.

У цьому таску закриваємо **лише** базову сторінку та grid з картками. Toolbar, фільтри, breadcrumbs, пагінація — це окремі таски (12–15).

**Логіка (чому це робимо):**

- Зараз на Home (`/`) товари відображаються через `ProductCard`, який має кнопки **"Редагувати"** і **"Видалити"** — це адмінський функціонал, не клієнтський. Каталог — це **сторінка для покупця**: він хоче бачити фото, назву, ціну і кнопку "Додати в кошик", а не CRUD-інструменти.
- Тому потрібен **новий компонент** `CatalogCard` — "клієнтська" картка товару, орієнтована на конверсію (додати в кошик, перейти до деталей).
- Сторінка Catalog (`/catalog`) стане основним місцем перегляду асортименту. Home залишається вітриною (hero, featured, категорії — це буде пізніше).
- Роут `/catalog` вже визначений у `BottomNavigation`, але позначений як `enabled: false`. Після цього таску — він стане активним.

**Scope (важливо):**

- Створити сторінку `Catalog` з grid товарів.
- Створити компонент `CatalogCard` (клієнтський: фото, назва, ціна, "Додати в кошик").
- Додати роут `/catalog` до роутера.
- Увімкнути Catalog у `BottomNavigation`.
- **НЕ** робимо toolbar, sorting, filters, breadcrumbs (Tasks #12, #13, #15).
- **НЕ** робимо пагінацію/infinite scroll (окремий таск).
- **НЕ** чіпаємо Home — вона залишається як є.

**Що зробити (покроково):**

### Крок 1 — Створити компонент `CatalogCard`

- **Файл:** `frontend/src/components/CatalogCard.tsx` (create).
- **Чому окремий від `ProductCard`?** `ProductCard` — адмінська картка з Edit/Delete. `CatalogCard` — покупницька картка з "Додати в кошик" і переходом до деталей. Різні відповідальності = різні компоненти (SRP). В майбутньому вони можуть мати спільний "base" компонент, але зараз простіше тримати їх окремо.
- **Props (інтерфейс):**
    ```
    interface CatalogCardProps {
      id: number;
      title: string;
      price: number;
      image?: string;
    }
    ```
    Тобто це просто `Card`, але краще типізувати пропси явно — не прив'язуємо UI до DTO.
- **Структура картки (зверху вниз):**
    1. **Посилання-обгортка:** вся картка (або її верхня частина — зображення + назва) обгорнута в `<Link to={`/product/${id}`}>`. Клік по картці = перехід на деталі товару. Роут `/product/:id` ще не існує, але буде в Task #14.
    2. **Зображення:** якщо `image` є — `<img>` з `object-cover`, `rounded-t-xl`, висота ~`h-48` (адаптивно). Якщо `image` відсутній — placeholder: сірий блок з іконкою або текстом "No image". Використай іконку `ImageOff` з `lucide-react` (або аналогічну).
    3. **Тіло картки (padding):**
        - **Назва:** `<h3>`, `text-sm font-semibold text-gray-100`, `line-clamp-2` (обрізати довгі назви до 2 рядків).
        - **Ціна:** `font-mono font-bold text-violet-400` — гік-стиль шрифтом. Формат: `{price} ₴`.
    4. **Кнопка "Додати в кошик":**
        - Зовнішня від `<Link>` (щоб клік по кнопці не переходив на сторінку деталей).
        - Текст: "В кошик" або іконка `ShoppingCart` з `lucide-react` + короткий текст.
        - По кліку: `addToCart(id)` з `useAppContext()`.
        - Стилі: `bg-violet-600 hover:bg-violet-500`, `text-white`, `rounded-lg`, `w-full`, `py-2`.
        - `aria-label={`Додати "${title}" в кошик`}`.
- **Стилізація контейнера:**
    - `rounded-xl`, `border border-gray-700`, `bg-gray-800`.
    - Hover: `hover:border-violet-500/60`, `hover:shadow-lg hover:shadow-violet-900/20` (як у `ProductCard`, для консистентності).
    - `flex flex-col` — зображення зверху, контент знизу, кнопка приклеєна до низу (`mt-auto`).
    - `overflow-hidden` — щоб `rounded` працював з зображенням.
    - Transition: `transition-all duration-200` для плавності.

### Крок 2 — Створити сторінку `Catalog`

- **Файл:** `frontend/src/pages/Catalog.tsx` (create).
- **Структура:**
    1. **Заголовок секції:**
        - `<section aria-labelledby="catalog-heading">` (семантична обгортка).
        - `<h1 id="catalog-heading">` — "Каталог" (або "Каталог товарів").
        - Підзаголовок `<p>` — "Обирай серед усіх товарів" (або подібний).
    2. **Grid товарів:**
        - Завантаження через `fetchCards()` з `cardService.ts` (як на Home, але без CRUD).
        - Grid: `grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4`.
        - **Чому `grid-cols-2` (mobile)?** Для каталогу магазину 2 колонки на мобілці — стандарт (Rozetka, Amazon). Дає більше товарів на екрані, ніж 1 колонка. Home може залишатися з 1 колонкою (там більший фокус на Hero).
        - Кожен товар рендериться через `<CatalogCard {...card} />`.
    3. **Loading state:**
        - Скелетони: `CatalogCardSkeleton` — прямокутник, який імітує форму `CatalogCard`.
        - Кількість: 8 штук (2 ряди по 4 = заповнює десктопний grid).
        - Анімація: `animate-pulse`.
    4. **Empty state:**
        - Якщо `products.length === 0` і `!isLoading` — показати повідомлення: "Товарів поки немає".
        - Можна додати іконку `PackageOpen` з `lucide-react`.
    5. **Error state:**
        - Якщо `fetchCards()` падає — зберегти помилку в стані (`error: string | null`).
        - Показати: "Не вдалося завантажити товари. Спробуйте пізніше." з кнопкою "Спробувати знову" (яка викличе `loadProducts()` повторно).
- **Іменований експорт:** `export const CatalogPage = () => { ... }` (без `export default` — відповідно до правил проєкту).

### Крок 3 — Додати роут `/catalog` у роутер

- **Файл:** `frontend/src/routes/AppRoutes.tsx` (update).
- Додай новий child route:
    ```
    {
      path: "catalog",
      element: <CatalogPage />,
    }
    ```
- **Import:** `import { CatalogPage } from "../pages/Catalog"`.
- **Чому `path: "catalog"` а не `path: "/catalog"`?** У react-router v6 дочірні роути відносні до батьківського. Батько має `path: "/"`, тому `"catalog"` резолвиться в `/catalog`. Але `/catalog` теж працює — обирай стиль, який вже використовується в проєкті (зараз у тебе `path: "/"` для Home).

### Крок 4 — Увімкнути Catalog у `BottomNavigation`

- **Файл:** `frontend/src/layouts/BottomNavigation.tsx` (update).
- Знайди елемент з `to: "/catalog"` в масиві `bottomNavItems`.
- Зміни `enabled: false` на `enabled: true`.
- Тепер Catalog буде клікабельним у мобільній нижній панелі.

### Крок 5 — Навігація з Header (Desktop)

- **Файл:** `frontend/src/layouts/Header.tsx` — перевір, що у `NAV_LINKS` вже є `{ to: "/catalog", label: "Каталог" }`.
- Якщо є — нічого додатково не потрібно, NavLink вже рендериться.
- Якщо немає — додай.
- Зараз у `NAV_LINKS` є: `/`, `/catalog`, `/comics`, `/figures`, `/devices`, `/contacts` — тобто `/catalog` **вже є**. Все добре, десктопна навігація працюватиме з коробки.

**Файли для створення/змін:**

| Файл | Дія |
|------|-----|
| `frontend/src/components/CatalogCard.tsx` | **create** |
| `frontend/src/pages/Catalog.tsx` | **create** |
| `frontend/src/routes/AppRoutes.tsx` | update |
| `frontend/src/layouts/BottomNavigation.tsx` | update |

**Критерії приймання:**

- [ ] Сторінка `/catalog` існує і відображає grid товарів від API.
- [ ] `CatalogCard` має: зображення (або placeholder), назву (line-clamp-2), ціну (`font-mono`), кнопку "В кошик".
- [ ] Кнопка "В кошик" додає товар через `addToCart()` з `AppContext`.
- [ ] Клік по картці (зображення/назва) переходить на `/product/${id}`.
- [ ] Клік по кнопці "В кошик" **НЕ** переходить на сторінку деталей (event propagation оброблений).
- [ ] Grid: 2 колонки (mobile), 3 (tablet), 4 (desktop).
- [ ] Loading: показуються скелетони `CatalogCardSkeleton` (animate-pulse).
- [ ] Empty: повідомлення "Товарів поки немає" якщо API повернув `[]`.
- [ ] Error: повідомлення + кнопка "Спробувати знову".
- [ ] Catalog увімкнений в `BottomNavigation` (`enabled: true`).
- [ ] Роут `/catalog` додано в `AppRoutes.tsx`.
- [ ] Іменований експорт (`export const CatalogPage`).
- [ ] Немає `any`, TypeScript strict.
- [ ] Mobile-first: 2 колонки на малих екранах, картки не розтягуються.
