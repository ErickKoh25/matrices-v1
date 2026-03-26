# matrices-v1

Proyecto de operaciones con matrices con interfaz Web.

## Funcionalidad

El proyecto expone operaciones clásicas sobre matrices numéricas (tipo `number[][]`):

- Suma de matrices: `A + B`
- Resta de matrices: `A - B`
- Producto por escalar: `k * A`
- Producto de matrices: `A * B`
- Traspuesta: `A^T`
- Determinante (solo matrices cuadradas)

### Validaciones (comunes)

- Las matrices deben ser rectangulares y no vacías.
- Las operaciones que requieren dimensiones compatibles devuelven error si no se cumple.
- Cuando el backend detecta un problema lanza `ValueError` y lo convierte en respuesta HTTP `400` con:
  - `{"error": "mensaje"}`

> Nota: `determinante()` está implementado con recursión por menores (cofactores), por lo que puede tardar para tamaños grandes.

## Stack utilizado

- Backend:
  - Python 3.x
  - FastAPI (API REST)
  - Uvicorn (servidor ASGI)
  - Pydantic (modelos de request/response)
- Frontend:
  - Node.js 18+ (recomendado)
  - React (TS)
  - Vite (dev server + build)

## Estructura del repo

- `matrices.py`: lógica original (operaciones puras + CLI en consola)
- `backend/`: API REST (FastAPI)
  - `backend/app/main.py`: inicializa la app y CORS
  - `backend/app/routers/matrices.py`: endpoints `/api/*`
  - `backend/app/logic/matrices_adapter.py`: adaptador que importa la lógica de `matrices.py`
- `frontend/`: app React (Vite)

## Tecnologías necesarias a instalar

### Python

1. Instala Python 3 (recomendado 3.10+).
2. Asegúrate de que `python3` esté disponible en tu PATH.

### Node.js (para frontend)

1. Instala Node.js.
2. Asegúrate de que `node` y `npm` estén disponibles en tu PATH.

## Cómo levantar el backend (FastAPI)

1. Ve a la carpeta del backend:

```bash
cd backend
```

2. Crea/activa un entorno virtual (opcional pero recomendado):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Instala dependencias:

```bash
pip install -r requirements.txt
```

4. Levanta el servidor (puerto `8000`):

```bash
uvicorn app.main:app --reload --port 8000
```

## Cómo levantar el frontend (React/Vite)

1. Ve a la carpeta del frontend:

```bash
cd frontend
```

2. Instala dependencias:

```bash
npm install
```

3. Levanta el dev server (puerto `3000`):

```bash
npm run dev
```

> El frontend usa CORS hacia `http://localhost:8000` y está configurado para correr en `3000`.

## Endpoints del API (para test con ejemplos)

Todos los endpoints reciben y responden JSON.

### Suma

`POST /api/suma`

**Request**
```json
{ "m1": [[1, 2], [3, 4]], "m2": [[5, 6], [7, 8]] }
```

**Response**
```json
{ "result": [[6, 8], [10, 12]] }
```

Ejemplo con `curl`:

```bash
curl -s -X POST http://localhost:8000/api/suma \
  -H "Content-Type: application/json" \
  -d '{"m1":[[1,2],[3,4]],"m2":[[5,6],[7,8]]}'
```

### Resta

`POST /api/resta`

**Request**
```json
{ "m1": [[1, 2], [3, 4]], "m2": [[5, 6], [7, 8]] }
```

**Response**
```json
{ "result": [[-4, -4], [-4, -4]] }
```

### Producto por escalar

`POST /api/escalar`

**Request**
```json
{ "m": [[1, 2], [3, 4]], "escalar": 2.5 }
```

**Response**
```json
{ "result": [[2.5, 5.0], [7.5, 10.0]] }
```

### Producto de matrices

`POST /api/multiplicar`

**Request**
```json
{ "a": [[1, 2], [3, 4]], "b": [[5, 6], [7, 8]] }
```

**Response**
```json
{ "result": [[19, 22], [43, 50]] }
```

### Traspuesta

`POST /api/trasponer`

**Request**
```json
{ "m": [[1, 2], [3, 4]] }
```

**Response**
```json
{ "result": [[1, 3], [2, 4]] }
```

### Determinante (cuadrada)

`POST /api/determinante`

**Request**
```json
{ "m": [[1, 2], [3, 4]] }
```

**Response**
```json
{ "det": -2.0 }
```

### Ejemplo de error (dimensiones incompatibles)

Si el backend detecta un error por validación, responde con `400`:

```json
{ "error": "Las matrices deben tener la misma dimensión para sumar" }
```

## Recomendaciones de test (entradas/salidas)

### Test manual rápido (frontend)

1. Abre el frontend en `http://localhost:3000`.
2. Elige una operación.
3. Pega matrices en formato JSON `number[][]` en los `textarea`, por ejemplo:
   - `[[1, 2], [3, 4]]`
4. Presiona `Calcular`.
5. Verifica:
   - resultado mostrado como tabla para operaciones que devuelven matriz
   - determinante mostrado como número para `Determinante`
   - mensaje de error si no es rectangular/cuadrada o si no coincide la dimensión

### Test directo (backend)

Ejecuta los `curl` de arriba o prueba en Postman/Insomnia usando:

- `Content-Type: application/json`
- Body con matrices como arreglos de arreglos, por ejemplo `[[1,2],[3,4]]`

