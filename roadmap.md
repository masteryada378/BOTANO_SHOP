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

**Назва:** Переробити `AppContext` на повноцінну CartItem-модель із збереженням у localStorage

**Бекграунд (Блок D — Cart & Checkout, пункт 1 + 4 з бэклогу):**

Перший крок Блоку D. Зараз кошик — це `number[]` (просто масив ID). Цього недостатньо для реальної сторінки кошика: потрібно знати **кількість** кожного товару, **ціну на момент додавання** (price snapshot), **назву** і **зображення** (щоб рендерити список без додаткових запитів до API). Також кошик не зберігається між перезавантаженнями — при F5 все пропадає.

Цей таск об'єднує два пункти бэклогу (розширення моделі + localStorage persist), бо вони логічно нерозривні: немає сенсу зберігати в localStorage масив `number[]`, який ні на що не годиться.

Після цього таску:
- Task #17: сторінка Cart.
- Task #18: сторінка Checkout з валідацією.

**Логіка (чому це робимо):**

- **Price snapshot** — ціна товару може змінитися після додавання в кошик. Юзер додав товар за 299 грн, а через годину ціна стала 399 грн. Кошик має показувати ціну **на момент додавання**. Це стандарт e-commerce (Amazon, Rozetka, eBay).
- **CartItem замість number[]** — сторінка кошика повинна рендерити список з назвою, зображенням, ціною, кількістю БЕЗ додаткових запитів до API. Якщо зберігати тільки ID — потрібно при кожному рендері завантажувати товари з бекенду, що повільно і ненадійно (товар могли видалити).
- **Quantity management** — коли юзер натискає "В кошик" двічі на один товар — кількість має збільшитися до 2, а не створювати дублікат. Потрібні `increaseQuantity`, `decreaseQuantity`, `removeFromCart`.
- **localStorage** — кошик має переживати перезавантаження сторінки, закриття вкладки і навіть перезапуск браузера. `localStorage` — найпростіший спосіб для клієнтського persist. `sessionStorage` не підходить — він зникає при закритті вкладки.
- **Computed values** — `totalItems` (для badge у Header) і `totalPrice` (для сторінки кошика та checkout) мають обчислюватися автоматично від стану кошика. Це похідні дані, не окремий state.

**Scope:**

- Створити тип `CartItem` (id, title, price, image, quantity).
- Переробити `AppContext`: замінити `cart: number[]` на `cart: CartItem[]`.
- Додати методи: `addToCart(item)`, `removeFromCart(id)`, `updateQuantity(id, quantity)`, `clearCart()`.
- Додати computed: `totalItems`, `totalPrice`.
- Зберігати кошик у `localStorage` при кожній зміні.
- Відновлювати кошик з `localStorage` при ініціалізації.
- Оновити всі місця, що використовують старий `addToCart(id: number)`: `CatalogCard`, `ProductDetail`, Header badge.
- **НЕ** робимо серверний кошик (поки тільки клієнтський).
- **НЕ** робимо промокоди (буде на сторінці Cart).

**Що зробити (покроково):**

### Крок 1 — Створити тип `CartItem`

- **Файл:** `frontend/src/types/Cart.ts` (create).
- Створи інтерфейс:

```typescript
export interface CartItem {
  id: number;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}
```

- **Чому окремий файл, а не в `Card.ts`?** CartItem — це не Card. Card — модель товару з бекенду. CartItem — модель позиції в кошику з локальними даними (quantity, price snapshot). Різна відповідальність → різні файли (SRP).

### Крок 2 — Створити хелпери для localStorage

- **Файл:** `frontend/src/lib/storage.ts` (create).
- Дві функції:
  - `getStorageItem<T>(key: string, fallback: T): T` — читає з localStorage, парсить JSON, повертає `fallback` при помилці (corrupted data, SSR, private mode).
  - `setStorageItem<T>(key: string, value: T): void` — серіалізує в JSON і записує. Мовчки ігнорує помилки (quota exceeded).
- **Чому хелпери, а не прямий `localStorage.getItem`?** Повторюваний try/catch + JSON.parse в кожному компоненті — DRY violation. Плюс localStorage кидає виключення в Safari private mode і при переповненні квоти.
- **Ключ кошика:** `"botano_cart"` — з префіксом проєкту, щоб не конфліктувати з іншими додатками на localhost.

### Крок 3 — Переробити `AppContext`

- **Файл:** `frontend/src/context/AppContext.tsx` (update).
- **Новий тип контексту:**

```typescript
type AppContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};
```

- **`addToCart` логіка:** якщо товар з таким `id` вже в кошику — `quantity += 1`. Інакше — додати новий `CartItem` з `quantity: 1`. Ціна береться з параметра (price snapshot).
- **`removeFromCart`:** фільтрує масив по `id`.
- **`updateQuantity`:** якщо `quantity <= 0` — видаляє товар. Інакше — оновлює quantity. Це дозволяє кнопці "−" автоматично видаляти товар при зменшенні до 0.
- **`totalItems`:** `cart.reduce((sum, item) => sum + item.quantity, 0)`. Використовується в Header badge.
- **`totalPrice`:** `cart.reduce((sum, item) => sum + item.price * item.quantity, 0)`. Використовується на сторінці кошика.
- **Persist:** використай `useEffect` з залежністю від `cart` — при кожній зміні записувай у localStorage. Ініціалізація: `useState(() => getStorageItem("botano_cart", []))`.
- **Чому `Omit<CartItem, "quantity">` в `addToCart`?** Компонент, що додає товар, не повинен вказувати кількість — вона завжди починається з 1 або інкрементується. Кількість — внутрішня відповідальність контексту.

### Крок 4 — Оновити `CatalogCard`

- **Файл:** `frontend/src/components/CatalogCard.tsx` (update).
- Старий виклик: `addToCart(id)` → Новий: `addToCart({ id, title, price, image })`.
- Компонент вже має `title`, `price`, `image` в props — просто передай їх.
- Якщо CatalogCard не отримує `title`/`price` — додай ці props.

### Крок 5 — Оновити `ProductDetail`

- **Файл:** `frontend/src/pages/ProductDetail.tsx` (update).
- Старий виклик: `addToCart(product.id)` → Новий: `addToCart({ id: product.id, title: product.title, price: product.price, image: product.image })`.
- Тут product вже завантажений — просто деструктуруй потрібні поля.

### Крок 6 — Оновити Header badge

- **Файл:** `frontend/src/layouts/Header.tsx` (update).
- Старий: `cart.length` → Новий: `totalItems`.
- `totalItems` вже враховує `quantity` кожного товару — badge показує реальну кількість одиниць, а не кількість позицій.

### Крок 7 — Перевірити і оновити BottomNavigation

- **Файл:** `frontend/src/layouts/BottomNavigation.tsx` (update, якщо використовує `cart.length`).
- Аналогічно Header: `cart.length` → `totalItems`.

**Файли для створення/змін:**

| Файл                                          | Дія        |
| --------------------------------------------- | ---------- |
| `frontend/src/types/Cart.ts`                 | **create** |
| `frontend/src/lib/storage.ts`                | **create** |
| `frontend/src/context/AppContext.tsx`         | update     |
| `frontend/src/components/CatalogCard.tsx`    | update     |
| `frontend/src/pages/ProductDetail.tsx`       | update     |
| `frontend/src/layouts/Header.tsx`            | update     |
| `frontend/src/layouts/BottomNavigation.tsx`  | update     |

**Критерії приймання:**

- `CartItem` тип має поля: `id`, `title`, `price`, `image?`, `quantity`.
- `addToCart` додає новий товар з `quantity: 1` або інкрементує існуючий.
- `removeFromCart` видаляє товар з кошика по `id`.
- `updateQuantity` змінює кількість; при `quantity <= 0` — видаляє товар.
- `clearCart` очищає кошик повністю.
- `totalItems` повертає суму `quantity` всіх позицій.
- `totalPrice` повертає суму `price * quantity` по всіх позиціях.
- При F5 кошик відновлюється з `localStorage`.
- При додаванні/видаленні товарів — `localStorage` оновлюється автоматично.
- Header badge показує `totalItems` (не кількість позицій, а одиниць).
- `CatalogCard` і `ProductDetail` використовують новий `addToCart({ id, title, price, image })`.
- Corrupted localStorage не ламає додаток (fallback на пустий масив).
- Немає `any`, TypeScript strict.

---

## 24) Task #17 ✅ — Сторінка кошика (Cart Page)

**Назва:** Реалізувати сторінку `/cart` зі списком товарів, зміною кількості та підсумком

**Бекграунд (Блок D — Cart & Checkout, пункт 2 з бэклогу):**

Другий крок Блоку D. Модель кошика з Task #16 вже зберігає `CartItem[]` з кількістю, ціною, назвою. Але юзер не має інтерфейсу для перегляду і редагування кошика — кнопка "Кошик" у Header/BottomNav поки нікуди не веде. Потрібна повноцінна сторінка кошика.

Після цього таску:
- Task #18: сторінка Checkout з валідацією.

**Логіка (чому це робимо):**

- **Cart Page** — обов'язковий етап воронки покупки. Юзер хоче: 1) побачити що він додав, 2) змінити кількість, 3) видалити зайве, 4) побачити загальну суму, 5) перейти до оформлення. Без цієї сторінки покупка неможлива.
- **Зміна кількості (+/−)** — стандарт e-commerce. Юзер не повинен видаляти товар і додавати заново, щоб змінити кількість. Кнопки `+`/`−` інтуїтивно зрозумілі.
- **Subtotal per item** — показуємо `ціна × кількість` біля кожного товару. Юзер одразу бачить скільки коштує кожна позиція.
- **Пустий кошик** — якщо кошик порожній — показуємо friendly повідомлення з посиланням на каталог. Не просто blank page.
- **Order Summary** — sticky блок з підсумком (total, кількість позицій) і кнопкою "Оформити замовлення". На мобілці — внизу сторінки, на desktop — справа (sidebar).

**Scope:**

- Створити сторінку `CartPage` (`/cart`).
- Створити компонент `CartItemRow` (один рядок товару в кошику).
- Додати маршрут `/cart` у `AppRoutes`.
- Підключити навігацію: Header іконка кошика → `/cart`, BottomNav "Кошик" → `/cart`.
- Реалізувати зміну кількості (+/−), видалення, очищення кошика.
- Показати subtotal per item, total, кількість позицій.
- Кнопка "Оформити замовлення" → `/checkout` (поки просто Link, сторінка Checkout буде в Task #18).
- Пустий стан: іконка, текст, кнопка "До каталогу".
- **НЕ** робимо промокод (можна додати пізніше як окремий feature).
- **НЕ** робимо збереження кошика на бекенді (поки тільки localStorage).

**Що зробити (покроково):**

### Крок 1 — Створити компонент `CartItemRow`

- **Файл:** `frontend/src/components/CartItemRow.tsx` (create).
- **Props:** `item: CartItem`, `onUpdateQuantity: (id: number, qty: number) => void`, `onRemove: (id: number) => void`.
- **UI-структура (mobile-first):**
  1. **Зображення:** `w-20 h-20 rounded-lg object-cover bg-gray-800` з placeholder якщо `image` відсутній. Клікабельне — `Link to={/product/${item.id}}`.
  2. **Info блок (flex-1):**
     - Назва товару: `text-sm font-medium text-white`, `truncate` або `line-clamp-2`.
     - Ціна за одиницю: `text-sm text-gray-400`.
  3. **Quantity controls (flex, items-center, gap-2):**
     - Кнопка `−`: `w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700`. При `quantity === 1` — кнопка стає іконкою `Trash2` (видалення).
     - Кількість: `text-center min-w-[2rem] text-white font-medium`.
     - Кнопка `+`: `w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700`.
  4. **Subtotal:** `text-right font-semibold text-emerald-400`. Формат: `price × quantity`. На мобілці — під quantity controls.
  5. **Кнопка видалення:** іконка `X` або `Trash2` з `lucide-react`, `text-gray-500 hover:text-red-400`. Підтвердження видалення НЕ потрібне (можна додати пізніше).
- **Семантика:** `<li>` елемент (батьківський `<ul>` буде у CartPage).
- **Анімація:** опціонально — `transition-colors` на hover стану.

### Крок 2 — Створити сторінку `CartPage`

- **Файл:** `frontend/src/pages/CartPage.tsx` (create).
- **Структура:**
  1. **Breadcrumbs:** "Головна > Кошик".
  2. **Заголовок:** `<h1>Кошик</h1>` з кількістю позицій (`totalItems товарів`).
  3. **Пустий стан** (якщо `cart.length === 0`):
     - Іконка `ShoppingCart` з `lucide-react`, великий розмір, `text-gray-600`.
     - Текст: "Ваш кошик порожній".
     - Підтекст: "Додайте товари з каталогу".
     - Кнопка: `<Link to="/catalog">` — "Перейти до каталогу" (`bg-violet-600`).
  4. **Список товарів** (якщо `cart.length > 0`):
     - `<ul>` з `CartItemRow` для кожного елемента.
     - Розділювачі між елементами: `divide-y divide-gray-800`.
  5. **Кнопка "Очистити кошик":** `text-sm text-gray-400 hover:text-red-400`, іконка `Trash2`. Розташування — під заголовком або під списком.
  6. **Order Summary блок:**
     - На мобілці: під списком товарів, `sticky bottom-0` з `bg-gray-900/95 backdrop-blur` (щоб кнопка "Оформити" завжди видима). Або без sticky — просто внизу.
     - На desktop (`md+`): справа від списку у grid `md:grid-cols-[1fr_320px]`.
     - Вміст:
       - "Разом:" + `totalPrice` грн (великий, bold, `text-emerald-400`, `JetBrains Mono`).
       - Кількість: "3 товари на суму ..." (використай `pluralize`).
       - Кнопка "Оформити замовлення": `bg-violet-600 hover:bg-violet-700 w-full py-3 rounded-xl text-lg font-semibold`.
       - `<Link to="/checkout">` — поки Checkout не існує, кнопка веде на `/checkout` (буде 404 або заглушка до Task #18).
       - Під кнопкою: "Продовжити покупки" — `<Link to="/catalog">`, `text-sm text-violet-400 hover:text-violet-300`.
- **Форматування цін:** створи utility `formatPrice(value: number): string` у `frontend/src/lib/formatPrice.ts` — форматує число в гривні (наприклад, `1 299 грн`). Використай `Intl.NumberFormat("uk-UA")`. Повторно використовуй у `CartItemRow`, `CartPage`, і пізніше в `Checkout`.

### Крок 3 — Додати маршрут `/cart` у AppRoutes

- **Файл:** `frontend/src/routes/AppRoutes.tsx` (update).
- Додати: `{ path: "cart", element: <CartPage /> }`.

### Крок 4 — Підключити навігацію на `/cart`

- **Файл:** `frontend/src/layouts/Header.tsx` (update).
- Іконка кошика в Header має вести на `/cart` (`<Link to="/cart">`). Зараз вона може бути просто декоративною — перетвори на посилання.
- **Файл:** `frontend/src/layouts/BottomNavigation.tsx` (update).
- Кнопка "Кошик" у BottomNavigation має вести на `/cart`. Якщо зараз це заглушка — підключи реальний шлях.

### Крок 5 — Створити `formatPrice` utility

- **Файл:** `frontend/src/lib/formatPrice.ts` (create).
- Функція `formatPrice(value: number): string`.
- Використай `new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)` + суфікс ` грн`.
- **Чому utility?** Ціни відображаються в 5+ місцях (CatalogCard, ProductDetail, CartItemRow, CartPage, Checkout). Один формат — один файл.

**Файли для створення/змін:**

| Файл                                          | Дія        |
| --------------------------------------------- | ---------- |
| `frontend/src/components/CartItemRow.tsx`     | **create** |
| `frontend/src/pages/CartPage.tsx`            | **create** |
| `frontend/src/lib/formatPrice.ts`            | **create** |
| `frontend/src/routes/AppRoutes.tsx`          | update     |
| `frontend/src/layouts/Header.tsx`            | update     |
| `frontend/src/layouts/BottomNavigation.tsx`  | update     |

**Критерії приймання:**

- Маршрут `/cart` працює, сторінка рендериться.
- Пустий кошик: іконка, текст "Ваш кошик порожній", кнопка "Перейти до каталогу".
- Кожен товар у списку: зображення (або placeholder), назва, ціна за одиницю, кількість (+/−), subtotal.
- Кнопка `−` при `quantity === 1` видаляє товар (або стає іконкою Trash).
- Кнопка `+` інкрементує кількість.
- "Очистити кошик" видаляє всі товари.
- Order Summary: загальна сума, кількість товарів, кнопка "Оформити замовлення" (→ `/checkout`).
- "Продовжити покупки" → `/catalog`.
- Зображення товару — Link на `/product/:id`.
- Breadcrumbs: "Головна > Кошик".
- Header іконка кошика веде на `/cart`.
- BottomNavigation "Кошик" веде на `/cart`.
- `formatPrice` utility коректно форматує ціни (1299 → "1 299 грн").
- Mobile-first: вертикальний layout на мобілці, sidebar на desktop (md+).
- Семантичний HTML: `<h1>`, `<ul>`, `<li>`.
- Немає `any`, TypeScript strict.

---

## 25) Task #18 ✅ — Сторінка Checkout з валідацією та збереженням замовлення

**Назва:** Реалізувати сторінку `/checkout` з формою, валідацією і backend для замовлень

**Бекграунд (Блок D — Cart & Checkout, пункт 3 з бэклогу):**

Третій і **останній** крок Блоку D. Кошик працює (Task #16–17), юзер бачить свої товари і суму. Тепер потрібен фінальний крок — **оформлення замовлення**: юзер вводить контактні дані, обирає доставку/оплату, переглядає підсумок і натискає "Підтвердити".

Після цього таску **Блок D (Cart & Checkout) буде повністю закритий**. Наступний етап — Блок E (Auth/Profile/Admin).

**Логіка (чому це робимо):**

- **Checkout** — фінальна точка конверсії. Якщо тут все зрозуміло і зручно — юзер завершує покупку. Якщо ні — кидає кошик. За статистикою ~70% кошиків abandonment rate — і UX checkout є ключовим фактором.
- **Серверне збереження** — замовлення має зберігатися в БД, а не тільки на клієнті. Потрібна таблиця `orders` і `order_items` (нормалізована структура: одне замовлення → багато позицій).
- **Валідація** — ім'я, телефон, email, адреса доставки обов'язкові. Клієнтська валідація — перша лінія захисту (UX). Серверна валідація — обов'язкова (безпека), але зараз фокус на клієнтській.
- **Single-page checkout** — для MVP не робимо multi-step wizard (крок 1 → крок 2 → крок 3). Одна сторінка з секціями — простіше для розробки і достатньо для навчального проєкту. Multi-step можна додати пізніше.
- **Order Summary** — дублюємо summary з кошика на сторінці checkout. Юзер має бачити що він купує на кожному кроці.

**Scope:**

- Backend: створити таблиці `orders` і `order_items`, endpoint `POST /orders`.
- Frontend: сторінка `CheckoutPage` (`/checkout`) з формою.
- Форма: контактні дані (ім'я, телефон, email), адреса доставки, спосіб доставки (select), спосіб оплати (radio).
- Валідація: обов'язкові поля, формат телефону/email.
- Order Summary: список товарів з кошика + підсумок.
- При успішному замовленні: очистити кошик, показати confirmation (або redirect на success-сторінку).
- **НЕ** робимо реальну оплату (mock).
- **НЕ** робимо інтеграцію з Новою Поштою API (dropdown з типами доставки поки хардкод).
- **НЕ** робимо guest checkout vs auth checkout (поки все guest — auth буде у Блоці E).
- **НЕ** робимо multi-step wizard (одна сторінка).

**Що зробити (покроково):**

### Крок 1 — Створити таблиці `orders` та `order_items` у БД

- **Файл:** `backend/src/database.ts` (update — додати auto-migration).
- **Таблиця `orders`:**

```sql
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
);
```

- **Таблиця `order_items`:**

```sql
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

- **Чому `title` і `price` в `order_items`?** Снепшот на момент замовлення. Якщо товар перейменують або змінять ціну — старі замовлення мають зберігати оригінальні дані.
- **Чому `status`?** Мінімальний lifecycle: `pending` → `confirmed` → `shipped` → `completed`. Зараз все буде `pending`, але поле готове для розширення.

### Крок 2 — Створити backend endpoint `POST /orders`

- **Файл:** `backend/src/routes/orders.ts` (create).
- **Request body:**

```typescript
interface CreateOrderBody {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_method: string;
  delivery_address: string;
  payment_method: string;
  items: Array<{
    product_id: number;
    title: string;
    price: number;
    quantity: number;
  }>;
}
```

- **Логіка:**
  1. Валідація: перевірити що `items` не порожній, обов'язкові поля заповнені.
  2. Обчислити `total_price` = `sum(price * quantity)` по всіх items.
  3. В **транзакції**: INSERT в `orders` → отримати `insertId` → INSERT кожен item в `order_items` з `order_id`.
  4. Відповідь: `201 Created` з `{ id: orderId, status: "pending" }`.
- **Чому транзакція?** Якщо INSERT в `order_items` зламається на третьому елементі — замовлення в `orders` не повинно залишитися без повного списку товарів. Транзакція гарантує атомарність.
- **Файл:** `backend/src/server.ts` (update).
- Підключити: `app.use("/orders", ordersRouter)`.

### Крок 3 — Створити типи для Checkout

- **Файл:** `frontend/src/types/checkout.ts` (create).
- Створити:

```typescript
export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryMethod: string;
  deliveryAddress: string;
  paymentMethod: string;
}

export const DELIVERY_METHODS = [
  { value: "nova_poshta", label: "Нова Пошта (відділення)" },
  { value: "nova_poshta_courier", label: "Нова Пошта (кур'єр)" },
  { value: "ukrposhta", label: "Укрпошта" },
  { value: "pickup", label: "Самовивіз" },
] as const;

export const PAYMENT_METHODS = [
  { value: "card_on_delivery", label: "Картою при отриманні" },
  { value: "cash_on_delivery", label: "Готівкою при отриманні" },
  { value: "card_online", label: "Оплата онлайн (картка)" },
] as const;
```

### Крок 4 — Створити API-сервіс для замовлень

- **Файл:** `frontend/src/services/orderService.ts` (create).
- Функція `createOrder(data): Promise<{ id: number; status: string }>`.
- Збирає дані форми + items з кошика → POST `/orders`.

### Крок 5 — Створити хук валідації `useCheckoutForm`

- **Файл:** `frontend/src/hooks/useCheckoutForm.ts` (create).
- Хук інкапсулює:
  - Стан форми (`formData`).
  - Помилки валідації (`errors: Record<string, string>`).
  - `handleChange(field, value)` — оновлює поле і знімає помилку.
  - `validate(): boolean` — перевіряє всі поля, повертає `true` якщо валідна.
- **Правила валідації:**
  - `customerName`: не порожнє, мінімум 2 символи.
  - `customerPhone`: не порожнє, відповідає UA-формату (`/^\+?3?8?0\d{9}$/` або простіше — мінімум 10 цифр).
  - `customerEmail`: не порожнє, базовий email regexp (`/.+@.+\..+/`).
  - `deliveryMethod`: обрано (не порожнє).
  - `deliveryAddress`: не порожнє (мінімум 5 символів). Якщо `deliveryMethod === "pickup"` — можна не вимагати.
  - `paymentMethod`: обрано (не порожнє).
- **Чому хук, а не логіка в компоненті?** SRP — компонент рендерить UI, хук обробляє бізнес-логіку форми. Хук можна тестувати окремо.

### Крок 6 — Створити сторінку `CheckoutPage`

- **Файл:** `frontend/src/pages/CheckoutPage.tsx` (create).
- **Guard:** якщо кошик порожній — redirect на `/cart` (або показати "Кошик порожній, оформлення неможливе").
- **Layout (mobile-first):**
  1. **Breadcrumbs:** "Головна > Кошик > Оформлення".
  2. **Заголовок:** `<h1>Оформлення замовлення</h1>`.
  3. **Mobile:** одна колонка — форма зверху, summary знизу.
  4. **Desktop (md+):** grid `md:grid-cols-[1fr_380px]` — форма зліва, summary справа (sticky).
- **Секція "Контактні дані":**
  - Input: Ім'я (`text`), Телефон (`tel`), Email (`email`).
  - Кожен input: `label` + `input` + `error message`.
  - Стилі: `bg-gray-800 border-gray-700 rounded-lg text-white focus:border-violet-500`.
  - Помилки: `text-red-400 text-sm mt-1`.
- **Секція "Доставка":**
  - `<select>` або radio-група з `DELIVERY_METHODS`.
  - Input: Адреса доставки (textarea або text input). Ховається при `pickup`.
- **Секція "Оплата":**
  - Radio-група з `PAYMENT_METHODS`.
- **Order Summary (sidebar / bottom):**
  - Стисний список товарів: назва × кількість = subtotal.
  - Загальна сума: `totalPrice` грн.
  - Кількість товарів.
- **Кнопка "Підтвердити замовлення":**
  - `bg-violet-600 hover:bg-violet-700 w-full py-3 rounded-xl text-lg font-semibold`.
  - При натисканні: `validate()` → якщо OK → `createOrder(...)` → при успіху: `clearCart()` + показати success state.
  - Loading state: кнопка `disabled`, показує спінер або текст "Оформлення...".
- **Success state:** після успішного замовлення — показати "Замовлення #123 створено!" з іконкою `CheckCircle`, кнопкою "На головну" або "До каталогу". Можна зробити inline (замінити форму) або redirect на `/order-success/:id`.
- **Error state:** якщо `POST /orders` повернув помилку — показати toast або inline error.

### Крок 7 — Додати маршрут `/checkout` у AppRoutes

- **Файл:** `frontend/src/routes/AppRoutes.tsx` (update).
- Додати: `{ path: "checkout", element: <CheckoutPage /> }`.

**Файли для створення/змін:**

| Файл                                          | Дія        |
| --------------------------------------------- | ---------- |
| `backend/src/routes/orders.ts`               | **create** |
| `frontend/src/pages/CheckoutPage.tsx`        | **create** |
| `frontend/src/types/checkout.ts`             | **create** |
| `frontend/src/services/orderService.ts`      | **create** |
| `frontend/src/hooks/useCheckoutForm.ts`      | **create** |
| `backend/src/database.ts`                    | update     |
| `backend/src/server.ts`                      | update     |
| `frontend/src/routes/AppRoutes.tsx`          | update     |

**Критерії приймання:**

- Таблиці `orders` та `order_items` створюються при старті backend.
- `POST /orders` з валідним body → 201 з `{ id, status: "pending" }`.
- `POST /orders` з порожнім `items` → 400 з повідомленням.
- Маршрут `/checkout` працює, сторінка рендериться.
- Якщо кошик порожній — redirect на `/cart` або повідомлення.
- Форма: ім'я, телефон, email, доставка, адреса, оплата — все відображається.
- Валідація: порожні поля підсвічуються, невалідний телефон/email — повідомлення.
- Адреса ховається при виборі "Самовивіз".
- Order Summary: список товарів з кошика, загальна сума.
- "Підтвердити замовлення" → POST → очищення кошика → success state.
- Loading state на кнопці під час запиту.
- Error state якщо API поверне помилку.
- Breadcrumbs: "Головна > Кошик > Оформлення".
- Mobile-first: одна колонка, summary знизу. Desktop: sidebar справа.
- Семантичний HTML: `<form>`, `<fieldset>`, `<label>`, `<h1>`, `<h2>` для секцій.
- Немає `any`, TypeScript strict.

---

**Після завершення Tasks #16–#18 Блок D (Cart & Checkout) повністю закритий. Наступний етап — Блок E (Auth/Profile/Admin): Tasks #19+.**