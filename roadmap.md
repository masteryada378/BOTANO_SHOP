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
Виконано.

## 9) Task #3 ✅ — Healthcheck для MySQL у docker-compose

**Назва:** Додати healthcheck для `db` (MySQL), щоб мати “готовність сервісу”, а не “контейнер стартанув”
Виконано.

## 10) Task #4 ✅ — Backend має стартувати тільки після `db: healthy`

**Назва:** Змінити `depends_on` для `backend`, щоб він чекав готовність MySQL, а не просто “контейнер існує”
Виконано.

## 11) Task #5 ✅ — Оновити `README.md`: Quick Start + Environment + Troubleshooting

**Назва:** Привести `README.md` до стану “новий розробник не плаче, а запускає з першого разу”
Виконано.

## 12) Task #6 ✅ — Створити `BottomNavigation` компонент (mobile-first, поки без підключення)

**Назва:** Bottom Navigation skeleton (must-have для мобільного магазину)

**Логіка (чому це робимо):**

- На мобілці нижня навігація — це не “прикраса”, це **основний UX-патерн**. Без неї користувач втрачається швидше, ніж ти в Docker-логах о 3-й ночі.
- Ми **спочатку** робимо компонент як ізольований, типізований блок (SOLID/DRY), і тільки в наступному таску акуратно підключимо в `Layout`.
  **Scope (важливо):**
- В цьому таску **тільки створюємо компонент** і його API (props/типи), **не підключаємо** в layout і **не додаємо** нові роути.  
   (Це щоб ти не зламав навігацію “в процесі творчості”.)
  Виконано.

---

## 13) Task #7 ✅ — Підключити `BottomNavigation` у `Layout`

**Назва:** Інтеграція нижньої навігації в глобальний layout

**Виконано (що саме):**
- `BottomNavigation` підключено в `frontend/src/components/Layout.tsx`.
- Додано компенсацію нижнього padding для контенту, щоб fixed-nav **не перекривала** сторінку.
- Прокинуто `cartItemsCount` (поки як `cart.length`) у `BottomNavigation`.

**Файли:**
- `frontend/src/components/Layout.tsx` (update)
- `frontend/src/layouts/BottomNavigation.tsx` (update)

**Критерії приймання (перевірено):**
- На mobile nav видима під час скролу, контент не ховається під нею.
- Немає `any`.

---

## 14) Task #8 — Зробити badge кошика в `Header` динамічним (без хардкоду “3”)

**Назва:** Cart badge у Header від даних `AppContext`

**Логіка (чому це робимо):**
- Хардкод “3” — це класика жанру “намальований інтернет-магазин”. Поки badge фейковий, UX і довіра користувача фейкові теж.
- Один і той самий показник має бути консистентним у всіх місцях UI (Header + BottomNavigation).

**Scope:**
- В цьому таску міняємо **лише** Header badge (дані + відображення + a11y).
- Не додаємо нові сторінки/роути, не робимо checkout/cart сторінку.

**Що зробити (покроково):**
1. Відкрий `frontend/src/layouts/Header.tsx`.
2. Заміни “Placeholder badge” на badge, який бере кількість з `AppContext`.
   - Використай `useAppContext()` (з `frontend/src/context/AppContext.tsx`).
   - Розрахунок кількості на зараз: `cart.length` (бо в контексті поки масив id).
3. Логіка відображення:
   - Якщо `cartCount === 0` — **badge не показуємо взагалі** (інакше це шум).
   - Якщо `cartCount > 0` — показуємо badge з числом.
   - (Опційно, але бажано) Якщо `cartCount > 99` — показуємо `99+`, щоб не ламати верстку.
4. Accessibility:
   - `aria-label` має відповідати реальному значенню (наприклад: “У кошику 2 товари”).
   - Не залишай старий `aria-label="3 товари..."`.
5. Візуальний стиль:
   - Збережи поточну стилістику (violet badge), але переконайся, що badge не “стрибає” при появі/зникненні.
6. Перевірка:
   - Додай/прибери товари (через існуючі кнопки додавання, якщо вони є на Home), переконайся, що badge змінюється.
   - Badge в `BottomNavigation` і badge в `Header` мають показувати **одне й те саме** число.

**Файли для створення/змін:**
- `frontend/src/layouts/Header.tsx` (update)

**Критерії приймання:**
- В `Header` більше немає хардкодного числа “3”.
- Badge відображається лише коли `cartCount > 0`.
- `aria-label` відповідає реальній кількості.
- Немає `any`, TypeScript без деградації.
