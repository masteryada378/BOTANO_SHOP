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

- [ ] Layout: Header + BottomNav + Footer
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

## 17) Task #10 — Live search suggestions dropdown у Header

**Назва:** Підключити випадаючий список підказок до пошуку в Header

**Бекграунд (Блок B — Layout, пункт 10 з бэклогу):**

Це **останній** крок Блоку B (Layout). Після нього Етап 1 "Глобальний Layout" буде повністю закритий за DoD:
- ✅ Header: логотип, пошук з live suggestions, динамічний cart badge.
- ✅ Mobile Bottom Navigation.
- ✅ Footer.
- ✅ Навігація веде на реальні роути або тимчасові заглушки.

**Логіка (чому це робимо):**

- У Task #9 ми побудували **фундамент**: controlled input, `useDebounce`, backend `?q=` endpoint, `searchCards()` service method. Але візуально нічого не змінилося — юзер вводить текст, а результатів не бачить. Це як мати двигун без колес.
- Тепер потрібно закрити "останню милю" — **показати результати** пошуку в dropdown під інпутом. Це класичний UX-патерн "search suggestions" / "autocomplete", який є в кожному магазині (Amazon, Rozetka, тощо).
- Виносимо dropdown в **окремий компонент** `SearchSuggestions`, а не ліпимо все в Header — SRP: Header керує станом пошуку, `SearchSuggestions` відповідає за відображення результатів.

**Scope (важливо):**

- Робимо **тільки** dropdown з підказками під пошуковим інпутом.
- **НЕ** робимо повноцінну сторінку результатів пошуку (це буде частиною каталогу).
- **НЕ** робимо складну клавіатурну навігацію по списку (Arrow Up/Down) — це nice-to-have, але не зараз.
- Сторінка `/product/:id` ще не існує, тому кліком по підказці поки **переходимо на `/product/${id}`** — покаже порожню сторінку, але роут буде валідним коли створимо ProductDetail у Блоці C.

**Що зробити (покроково):**

### Крок 1 — Створити компонент `SearchSuggestions`

- **Файл:** `frontend/src/components/SearchSuggestions.tsx` (create).
- **Props (інтерфейс):**
    ```
    interface SearchSuggestionsProps {
      query: string;           // дебаунсований запит (debouncedQuery)
      onSelect: () => void;    // колбек при виборі підказки (щоб Header закрив пошук)
    }
    ```
- **Внутрішній стан:**
    - `results: Card[]` — масив знайдених товарів.
    - `isLoading: boolean` — індикатор завантаження.
- **Логіка (useEffect по `query`):**
    1. Якщо `query.trim().length < 2` — скинути `results` у `[]` і **не** робити запит (нема сенсу шукати за одну букву). Поріг 2 символи — стандарт для autocomplete.
    2. Якщо `query.length >= 2` — викликати `searchCards(query)` з `cardService.ts`.
    3. Перед запитом встановити `isLoading = true`, після (success або error) — `isLoading = false`.
    4. Результат записати в `results`.
    5. **Race condition:** якщо юзер швидко змінює запит, попередній `searchCards()` може повернутися пізніше за новий. Щоб уникнути "мерехтіння" результатів, використай **AbortController** або прапорець `let ignore = false` в cleanup useEffect:
        ```
        useEffect(() => {
          let cancelled = false;
          // ... fetch ...
          if (!cancelled) setResults(data);
          return () => { cancelled = true; };
        }, [query]);
        ```
- **Рендер:**
    - Якщо `query.length < 2` — **нічого не рендерити** (`return null`).
    - Якщо `isLoading` — показати текст "Шукаємо..." (або маленький спінер).
    - Якщо `results.length === 0` і `!isLoading` — показати "Нічого не знайдено за запитом «{query}»".
    - Якщо є результати — `<ul>` зі списком `<li>` для кожного товару.
- **Кожен елемент підказки (`<li>`):**
    - Обгорнути в `<Link to={`/product/${card.id}`}>`.
    - Показати: мініатюру зображення (якщо `card.image` є, 40×40px, `object-cover`, `rounded`), назву товару (`card.title`), ціну (`card.price ₴`, шрифт `font-mono`, колір `text-violet-400`).
    - При кліку — викликати `onSelect()` (щоб Header закрив dropdown і скинув query).
    - Hover-стан: `bg-gray-700` або аналогічний, щоб було видно курсор.
- **Стилізація контейнера:**
    - Список має з'являтися **під** пошуковим інпутом.
    - Фон: `bg-gray-800`, рамка: `border border-gray-700`, `rounded-lg`, `shadow-xl`.
    - Максимальна висота: `max-h-80` з `overflow-y-auto` (щоб на маленьких екранах не з'їдав весь простір).
    - Компонент має бути всередині потоку документа або позиціонуватись відносно обгортки пошуку.

### Крок 2 — Інтегрувати `SearchSuggestions` в Header

- **Файл:** `frontend/src/layouts/Header.tsx` (update).
- **Де розмістити:** всередині блоку `{isSearchOpen && (...)}`, **після** `<div>` з інпутом, але всередині того ж контейнера `border-t border-gray-800`.
- **Передати пропси:**
    - `query={debouncedQuery}`
    - `onSelect={() => setIsSearchOpen(false)}` — при виборі підказки закриваємо пошук.
- **Видалити** тимчасовий `console.log("Search:", debouncedQuery)` з Task #9 — він більше не потрібний, тепер є реальний UI.
- **Видалити** `useEffect`, що логував `debouncedQuery` — він існував тільки для дебагу.
- **Import:** додати `import { SearchSuggestions } from "../components/SearchSuggestions"`.

### Крок 3 — Закриття dropdown при кліку поза ним

- **Поведінка:** якщо юзер натискає кудись поза пошуковим блоком (інпут + dropdown), пошук має закритися.
- **Рекомендований підхід:** створити невеликий хук `useClickOutside(ref, callback)` у `frontend/src/hooks/useClickOutside.ts`, або реалізувати логіку прямо в Header через `useRef` + `useEffect` з `mousedown` listener.
- **Хук `useClickOutside`:**
    - **Файл:** `frontend/src/hooks/useClickOutside.ts` (create).
    - **Сигнатура:** `useClickOutside(ref: RefObject<HTMLElement | null>, callback: () => void): void`
    - Всередині: `useEffect` додає `document.addEventListener("mousedown", handler)`, де handler перевіряє `ref.current?.contains(event.target as Node)`. Якщо клік поза — `callback()`.
    - Cleanup: `removeEventListener` в return.
- **В Header:**
    - Обгорни весь блок пошуку (інпут + dropdown) в `<div ref={searchRef}>`.
    - Підключи: `useClickOutside(searchRef, () => setIsSearchOpen(false))`.
- **Escape:** додай обробник `onKeyDown` на інпут: якщо `e.key === "Escape"` — `setIsSearchOpen(false)`.

### Крок 4 — Доступність (a11y)

- `<ul>` зі списком підказок: додай `role="listbox"` і `aria-label="Результати пошуку"`.
- Кожен `<li>`: `role="option"`.
- Інпут пошуку: додай `aria-autocomplete="list"` і `aria-controls="search-suggestions"`.
- `<ul>` має мати `id="search-suggestions"` (щоб інпут міг на нього посилатися).
- Статусне повідомлення "Знайдено X результатів" або "Нічого не знайдено" — обгорни в `<div aria-live="polite">` щоб скрінрідер озвучив зміну.

**Файли для створення/змін:**

| Файл | Дія |
|------|-----|
| `frontend/src/components/SearchSuggestions.tsx` | **create** |
| `frontend/src/hooks/useClickOutside.ts` | **create** |
| `frontend/src/layouts/Header.tsx` | update |

**Критерії приймання:**

- [ ] Компонент `SearchSuggestions` існує, приймає `query` і `onSelect` пропси.
- [ ] При введенні >= 2 символів — з'являється dropdown з результатами від API.
- [ ] Показується стан "Шукаємо..." під час завантаження.
- [ ] Показується "Нічого не знайдено" якщо API повернув порожній масив.
- [ ] Кожна підказка містить: зображення (якщо є), назву, ціну.
- [ ] Клік по підказці закриває dropdown і переходить на `/product/${id}`.
- [ ] Клік поза пошуковим блоком закриває пошук.
- [ ] Натискання Escape закриває пошук.
- [ ] `console.log("Search:", debouncedQuery)` видалено з Header.
- [ ] Race condition оброблений (cancelled / ignore прапорець).
- [ ] Базова a11y: `role="listbox"`, `aria-live`, `aria-autocomplete`.
- [ ] Немає `any`, TypeScript strict.
- [ ] Мобільна версія: dropdown не виходить за межі екрану, скролиться при великій кількості результатів.
