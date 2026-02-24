# BOTANO_SHOP — Магазин для гіків-геймерів

## Технологічний стек

| Категорія          | Технології                               |
| ------------------ | ---------------------------------------- |
| **Фронтенд**       | React 19, TypeScript, Vite, Tailwind CSS |
| **Бекенд**         | Node.js, Express, TypeScript             |
| **База даних**     | MySQL 8.0                                |
| **Інфраструктура** | Docker, Docker Compose v2                |

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) встановлений і запущений.
- Використовуй **`docker compose`** (Compose v2, вбудований у Docker CLI), а не застарілий `docker-compose` (v1).

> Перевір версію: `docker compose version` — має бути `v2.x.x` або вище.

---

## Environment variables

`.env` файли **не комітяться** у репозиторій. У репо є лише шаблони.

### Крок 1 — Скопіюй шаблони

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Крок 2 — Заповни значення

#### `backend/.env`

| Змінна         | Значення для Docker Compose | Опис                                        |
| -------------- | --------------------------- | ------------------------------------------- |
| `PORT`         | `5005`                      | Порт, на якому запускається Express         |
| `DB_HOST`      | `db`                        | Ім'я сервісу MySQL у Compose (не localhost) |
| `DB_PORT`      | `3306`                      | Порт MySQL                                  |
| `DB_NAME`      | `spor_shop`                 | Назва бази даних                            |
| `DB_USER`      | `user`                      | Користувач БД                               |
| `DB_PASSWORD`  | `password`                  | Пароль БД                                   |
| `FRONTEND_URL` | `http://localhost:5173`     | URL фронтенду для CORS                      |

#### `frontend/.env`

| Змінна         | Значення                | Опис                                                |
| -------------- | ----------------------- | --------------------------------------------------- |
| `VITE_API_URL` | `http://localhost:5005` | URL бекенду — звідси фронтенд робить всі API-запити |

> `VITE_API_URL` **не** повинен мати trailing slash. Значення читається через `import.meta.env.VITE_API_URL`.

---

## Quick Start (Docker)

```bash
# Зібрати образи і підняти всі сервіси
docker compose up --build

# Зупинити сервіси (без видалення томів)
docker compose down
```

### Чистий старт (скидання БД)

> **Увага:** всі дані в базі будуть видалені.

```bash
docker compose down -v
docker compose up --build
```

---

## Ports / URLs

| Сервіс   | URL                                                |
| -------- | -------------------------------------------------- |
| Frontend | http://localhost:5173                              |
| Backend  | http://localhost:5005                              |
| MySQL    | localhost:3306 (зовнішній клієнт, напр. TablePlus) |

---

## Troubleshooting

### `db` залишається у стані `starting` або `unhealthy`

- MySQL потребує часу на ініціалізацію при першому старті (`start_period: 20s`).
- Зачекай 30–60 секунд і перевір: `docker compose ps`.
- Якщо `unhealthy` — перевір логи: `docker compose logs db`.
- Переконайся, що `MYSQL_ROOT_PASSWORD` у `docker-compose.yml` збігається з тим, що використовується в healthcheck.

### `backend` не стартує або падає одразу

- Перевір, що `backend/.env` існує і заповнений (особливо `DB_HOST=db`, а не `localhost`).
- Перевір логи: `docker compose logs backend`.
- `backend` стартує тільки після того, як `db` стане **healthy** — якщо БД ще не готова, backend чекатиме.
- Якщо помилка `Access denied` — перевір `DB_USER` / `DB_PASSWORD` у `backend/.env`.

### Frontend не бачить backend (мережеві помилки, CORS)

- Перевір `frontend/.env`: `VITE_API_URL` має вказувати на `http://localhost:5005` (без trailing slash).
- Після зміни `.env` потрібен перезапуск контейнера: `docker compose up --build frontend`.
- Перевір, що backend запущений і відповідає: `curl http://localhost:5005/api/health`.
- Якщо CORS-помилка — перевір `FRONTEND_URL` у `backend/.env` (має збігатися з адресою фронтенду).
