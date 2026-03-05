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

## 16) Task #9 — Фундамент live-search: стан, debounce hook, backend endpoint

**Назва:** Підготовка інфраструктури для живого пошуку товарів

**Бекграунд (Блок B — Layout, пункти 9-10 з бэклогу):**

Це передостанній крок Блоку B. Після нього залишиться лише Task #10 (dropdown з підказками), і Layout буде повністю закритий за DoD Етапу 1.

**Логіка (чому це робимо):**

- У Header вже є пошуковий інпут, але він **декоративний** — нікуди не зберігає значення, нічого не шукає. Це як кнопка ліфта, яка не підключена до двигуна.
- Перш ніж робити dropdown з підказками (Task #10), потрібно закласти **фундамент**: стан пошуку, debounce (щоб не DDoS-ити бекенд при кожному натисканні клавіші), і ендпоінт, який вміє фільтрувати товари.
- Розділяємо на два таски, бо "інфраструктура пошуку" та "UI dropdown" — різні відповідальності (SRP). Так легше тестувати і рев'юїти.

**Scope (важливо):**

- В цьому таску **НЕ** робимо dropdown з підказками (це Task #10).
- **НЕ** міняємо вигляд Header (візуально все залишається як є).
- Робимо тільки: хук `useDebounce`, пошуковий стан у Header, backend endpoint з `?q=`, frontend service method.

**Що зробити (покроково):**

### Крок 1 — Створити кастомний хук `useDebounce`

- **Файл:** `frontend/src/hooks/useDebounce.ts` (створити папку `hooks/` якщо немає).
- **Сигнатура:** `useDebounce<T>(value: T, delayMs: number): T`
- **Поведінка:**
    - Приймає будь-яке значення та затримку в мілісекундах.
    - Повертає "відкладену" версію значення, яка оновлюється лише через `delayMs` після останньої зміни вхідного `value`.
    - Використовує `useEffect` + `setTimeout` + `clearTimeout` (cleanup).
- **Чому generic `<T>`, а не `string`:** хук універсальний — завтра можна дебаунсити числовий фільтр ціни або інший тип.
- **Рекомендований delay для виклику:** 300ms (стандарт для пошукових підказок — досить швидко для UX, досить повільно щоб не спамити API).

### Крок 2 — Додати стан пошуку в Header

- **Файл:** `frontend/src/layouts/Header.tsx` (update).
- Додай стан: `const [searchQuery, setSearchQuery] = useState("")`
- Додай дебаунсоване значення: `const debouncedQuery = useDebounce(searchQuery, 300)`
- Підключи `searchQuery` до існуючого `<input>`:
    - `value={searchQuery}`
    - `onChange={(e) => setSearchQuery(e.target.value)}`
- **Важливо:** при закритті пошуку (`isSearchOpen` стає `false`) — очищай `searchQuery` до `""`, щоб при повторному відкритті інпут був чистим.
- Тимчасово `console.log("Search:", debouncedQuery)` для перевірки — прибереш у Task #10.
- `debouncedQuery` поки нікуди не передаємо — стане тригером для API-запиту в наступному таску.

### Крок 3 — Розширити backend endpoint для пошуку

- **Файл:** `backend/src/routes/cards.ts` (update).
- Розшир існуючий `GET /cards`, додавши підтримку query-параметра `?q=`:
    - Якщо `req.query.q` відсутній або порожній — повертай ВСІ картки (як зараз, без регресії).
    - Якщо `req.query.q` заданий — `SELECT * FROM cards WHERE title LIKE ? ORDER BY id DESC LIMIT 10` з параметром `%${q}%`.
- **Безпека:** ОБОВ'ЯЗКОВО використовуй параметризований запит (placeholder `?`), **НЕ** конкатенуй рядок у SQL (SQL injection).
- **Типізація:** `req.query.q` це `string | QueryString... | undefined`. Приведи явно:
    ```typescript
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    ```
- **Ліміт:** `LIMIT 10` для пошукового запиту — для підказок не потрібно багато результатів.
- Для повного списку (без `?q`) лімітів не додаємо (поки що).

### Крок 4 — Додати frontend service method для пошуку

- **Файл:** `frontend/src/services/cardService.ts` (update).
- Додай функцію:
    ```typescript
    export const searchCards = (query: string): Promise<Card[]> =>
      apiGet<Card[]>(`${RESOURCE}?q=${encodeURIComponent(query)}`);
    ```
- **Чому `encodeURIComponent`:** якщо юзер введе `&` або `#` у пошук, URL не зламається.
- Цю функцію поки **ніхто не викликає** — вона знадобиться в Task #10 коли підключимо dropdown.

**Файли для створення/змін:**

| Файл | Дія |
|------|-----|
| `frontend/src/hooks/useDebounce.ts` | **create** |
| `frontend/src/layouts/Header.tsx` | update |
| `backend/src/routes/cards.ts` | update |
| `frontend/src/services/cardService.ts` | update |

**Критерії приймання:**

- [ ] Хук `useDebounce` існує, типізований generic `<T>`, без `any`.
- [ ] Header `<input>` є controlled (`value` + `onChange`), debounce працює (видно в `console.log` при введенні тексту з затримкою ~300ms).
- [ ] При закритті пошуку (`isSearchOpen` стає `false`) стан скидається до `""`.
- [ ] `GET /cards?q=marvel` повертає лише товари з "marvel" у назві (case-insensitive через SQL `LIKE`).
- [ ] `GET /cards` без `?q` працює як раніше (без регресії).
- [ ] Пошуковий SQL використовує `?` placeholder (без конкатенації рядків).
- [ ] `searchCards()` існує в `cardService.ts`, правильно кодує query через `encodeURIComponent`.
- [ ] Немає `any`, TypeScript strict.
