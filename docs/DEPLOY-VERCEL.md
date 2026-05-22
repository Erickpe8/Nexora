# Deploy Nexora en Vercel (3 pasos tuyos + 1 comando)

## Lo que no se puede hacer sin ti

- Crear MySQL en la nube (cuenta gratuita en Railway).
- Iniciar sesión en Vercel (`npx vercel login`).

El resto lo hace `npm run vercel:finalizar`.

## Paso 1 — MySQL en Railway (5 min)

1. [railway.app](https://railway.app) → login con GitHub.
2. **New Project** → **Provision MySQL**.
3. Clic en el servicio MySQL → pestaña **Connect** / **Variables**.
4. Copia la URL que empiece por `mysql://`.

## Paso 2 — Pegar URL en el repo

```bash
cp db.remote.env.example db.remote.env
```

Edita `db.remote.env`:

```env
MYSQL_URL=mysql://...la-url-de-railway...
DB_SSL=true
```

(Si Railway no exige SSL, quita la línea `DB_SSL`.)

## Paso 3 — Login Vercel (una vez)

```bash
npm install
npx vercel login
npx vercel link
```

Elige el proyecto **nexora**.

## Paso 4 — Un solo comando

```bash
npm run vercel:finalizar
```

Eso: crea tablas en Railway, actualiza `.env.vercel` y sube variables a Vercel.

Si ya tenías la BD creada y actualizaste el código (reacciones, likes, denuncias), ejecuta también:

```bash
# Con db.remote.env (MYSQL_URL + DB_SSL=true)
set -a && source db.remote.env && set +a
npm run migrar --prefix backend
```

Luego en [vercel.com](https://vercel.com) → **Redeploy**.

## Comprobar

- https://nexora-ruddy-nine.vercel.app/api/salud → `"mysql": "ok"`
- https://nexora-ruddy-nine.vercel.app/ → login / registro

**Nota:** Socket.IO y el cron de posts por hora **no** corren en Vercel; solo con `npm run dev` en `backend/`.
