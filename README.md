# backendUpb – API de productos

API REST (Express 5 + PostgreSQL) con arquitectura por capas, desplegada en Render.

- **API en producción:** https://backendupbtest.onrender.com
- **Frontend que la consume:** https://test2-9f047.web.app ([repositorio](https://github.com/alanmcv/my-project))

> Render (plan gratis) apaga el servidor tras 15 min sin uso: la primera petición puede tardar ~1 minuto.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Lista todos |
| GET | `/api/productos?nombre=texto` | Busca por nombre (sin distinguir mayúsculas) |
| GET | `/api/productos/agotados` | Productos con stock 0 |
| GET | `/api/productos/:id` | Obtiene uno |
| POST | `/api/productos` | Crea `{ nombre, precio?, stock? }` |
| PUT | `/api/productos/:id` | Actualiza parcialmente |
| DELETE | `/api/productos/:id` | Elimina |

La colección de Postman está en `postman/backendUpb.postman_collection.json`.

## Correr en local

```bash
cp .env.example .env   # poner DATABASE_URL (External URL de Render) y DB_SSL=true
npm install
npm run db:init        # crea la tabla productos (solo la primera vez)
npm run dev            # http://localhost:3000
```

## Estructura

```
routes → controllers (+ dtos) → services → repositories (+ entities) → config/db
```

## Despliegue

Cada push a `dev` ejecuta `.github/workflows/deploy.yml`: verifica la sintaxis y llama al deploy hook de Render.
