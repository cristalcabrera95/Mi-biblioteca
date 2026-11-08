# Mi Biblioteca

Aplicación web CRUD de libros: React + PrimeReact (frontend), Node.js + Express + TypeScript (backend) y PostgreSQL (base de datos). El backend sirve también el frontend compilado, así que en Railway es **un solo servicio + una base de datos**.

## Funciones

- Consultar todos los libros (tabla con búsqueda, orden y paginación)
- Consultar un libro de forma individual (botón 👁)
- Agregar, editar y eliminar libros

## API

| Método | Ruta              | Acción                |
| ------ | ----------------- | --------------------- |
| GET    | /api/libros       | Todos los registros   |
| GET    | /api/libros/:id   | Un registro           |
| POST   | /api/libros       | Agregar               |
| PUT    | /api/libros/:id   | Editar                |
| DELETE | /api/libros/:id   | Eliminar              |

La tabla `libros` se crea sola al arrancar e inserta 4 libros de ejemplo si está vacía.

## Subir a Railway

1. Sube esta carpeta a un repositorio de GitHub.
2. En [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → elige el repositorio.
3. En el mismo proyecto: **+ Create** → **Database** → **Add PostgreSQL**.
4. Abre el servicio de la app → **Variables** → **New Variable**:
   - Nombre: `DATABASE_URL`
   - Valor: `${{Postgres.DATABASE_URL}}` (Railway lo autocompleta al escribir `${{`)
5. Railway detecta Node y ejecuta solo `npm install`, `npm run build` y `npm start`. Espera a que el deploy quede en verde.
6. Servicio de la app → **Settings** → **Networking** → **Generate Domain**. Ese es el link de tu sitio.

## Correr en local

```bash
npm install
# Terminal 1 (necesitas una base PostgreSQL)
DATABASE_URL=postgresql://usuario:clave@localhost:5432/biblioteca npm run dev:server
# Terminal 2
npm run dev:client   # http://localhost:5173
```
