# backendUpb – API de inventario

API REST (Express 5 + PostgreSQL) con arquitectura por capas, desplegada en Render. Gestiona productos y categorías.

- **API en producción:** https://backendupbtest-gp4v.onrender.com
- **Frontend que la consume:** https://test2-9f047.web.app ([repositorio](https://github.com/alanmcv/my-project))

> Render (plan gratis) apaga el servidor tras 15 min sin uso: la primera petición puede tardar ~1 minuto.

## Base de datos

```
categorias                         productos
──────────                         ─────────
id          SERIAL PK   ◄──┐       id           SERIAL PK
nombre      VARCHAR(50) UNIQUE │   nombre       VARCHAR(100) NOT NULL
created_at  TIMESTAMP          │   descripcion  VARCHAR(500)
                               │   precio       NUMERIC(10,2) CHECK (>= 0)
                               │   stock        INTEGER       CHECK (>= 0)
                               └── categoria_id INTEGER FK (ON DELETE SET NULL)
                                   created_at / updated_at  TIMESTAMP
```

- Una categoría tiene muchos productos (relación 1 a N).
- Si se borra una categoría, sus productos quedan "sin categoría" (no se borran).
- `src/db/schema.sql` se puede ejecutar varias veces sin perder datos; `npm start` lo aplica en cada arranque.

## Endpoints

### Productos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Lista todos. Filtros combinables: `?nombre=texto&categoria=1` |
| GET | `/api/productos/agotados` | Productos con stock 0 (acepta los mismos filtros) |
| GET | `/api/productos/resumen` | Totales: productos, unidades, valor del inventario, agotados |
| GET | `/api/productos/:id` | Obtiene uno |
| POST | `/api/productos` | Crea `{ nombre, descripcion?, precio?, stock?, categoriaId? }` |
| PUT | `/api/productos/:id` | Actualiza solo los campos enviados (`null` borra descripción/categoría) |
| DELETE | `/api/productos/:id` | Elimina |

### Categorías

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categorias` | Lista con la cantidad de productos de cada una |
| POST | `/api/categorias` | Crea `{ nombre }` (409 si el nombre ya existe) |
| PUT | `/api/categorias/:id` | Renombra |
| DELETE | `/api/categorias/:id` | Elimina (sus productos quedan sin categoría) |

Errores: siempre `{ "error": "mensaje" }` con 400 (datos inválidos), 404 (no existe), 409 (nombre repetido) o 500.

La colección de Postman está en `postman/backendUpb.postman_collection.json`.

## Correr en local

```bash
cp .env.example .env   # poner DATABASE_URL (External URL de Render) y DB_SSL=true
npm install
npm run db:init        # crea/actualiza las tablas
npm run db:seed        # (opcional) carga categorías y productos de ejemplo
npm run dev            # http://localhost:3000
```

## Estructura

```
routes → controllers (+ dtos) → services → repositories (+ entities) → config/db
```

Cada recurso (`producto`, `categoria`) tiene un archivo por capa. `utils/` contiene `HttpError` y `validarId`, compartidos.

## Despliegue

Cada push a `dev` ejecuta `.github/workflows/deploy.yml`: verifica la sintaxis y llama al deploy hook de Render, que corre `npm start` (migración + servidor).
