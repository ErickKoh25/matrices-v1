# Documentación de `matrices.py` y Propuesta de Frontend Web

## Qué hace el programa

`matrices.py` implementa un conjunto de operaciones básicas con matrices numéricas (tipo `List[List[float]]`) y un **menú interactivo de consola (CLI)** para que el usuario ingrese matrices manualmente y obtenga el resultado.

Cuando se ejecuta el archivo directamente (`python matrices.py`), se llama a `main()`, que muestra un menú de 7 opciones en un bucle. Dependiendo de la opción elegida:

- Se solicita por consola la(s) matriz(es) (y el escalar en el caso del producto escalar).
- Se valida la forma/dimensiones según la operación.
- Se calcula el resultado.
- Se imprime el resultado en consola (matrices con tabulaciones y determinantes como número).

El módulo no está diseñado como librería “web” por sí mismo; está pensado para la interacción por `stdin/stdout`. Sin embargo, todas las operaciones están encapsuladas en funciones puras (salvo entrada/salida), lo que permite exponerlas fácilmente como endpoints JSON.

## Tipos y representación

- `Matriz = List[List[float]]`
- Una matriz válida debe ser **no vacía** y **rectangular**:
  - Todas las filas deben tener la misma cantidad de columnas.

## Funciones de utilidad (validación e impresión)

### `imprimir_matriz(matriz: Matriz) -> None`
Imprime una matriz fila por fila.

- Recorre cada fila.
- Une los elementos con `\t` (tabulador).
- Imprime una línea por fila.

### `_es_matriz_valida(m: Matriz) -> bool` (privada)
Comprueba que la matriz:

1. No esté vacía (`if not m: return False`).
2. Sea rectangular: obtiene `ancho = len(m[0])` y exige que **todas** las filas tengan `len(fila) == ancho`.

### `son_misma_dim(m1: Matriz, m2: Matriz) -> bool`
Comprueba si dos matrices tienen las mismas dimensiones.

- Primero valida ambas matrices con `_es_matriz_valida`.
- Luego compara:
  - `len(m1) == len(m2)` (mismo número de filas)
  - `len(m1[0]) == len(m2[0])` (mismo número de columnas)

Devuelve `False` si alguna matriz no es válida o si las dimensiones no coinciden.

## Operaciones de matrices

En todas las operaciones donde aplique, si la entrada no cumple las reglas de validez/dimensiones, se levanta `ValueError`. En la interfaz CLI, ese `ValueError` se captura y se muestra como `Error: <mensaje>`.

### 1) Suma: `suma_matrices(m1: Matriz, m2: Matriz) -> Matriz`
Reglas:

- Requiere `son_misma_dim(m1, m2)`.
- Si no se cumple: lanza `ValueError("Las matrices deben tener la misma dimensión para sumar")`.

Resultado:

- Retorna una nueva matriz con `m1[i][j] + m2[i][j]` para cada posición.

### 2) Resta: `resta_matrices(m1: Matriz, m2: Matriz) -> Matriz`
Reglas:

- Requiere `son_misma_dim(m1, m2)`.
- Si no se cumple: lanza `ValueError("Las matrices deben tener la misma dimensión para restar")`.

Resultado:

- Retorna una nueva matriz con `m1[i][j] - m2[i][j]` para cada posición.

### 3) Producto por escalar: `producto_escalar(m: Matriz, escalar: float) -> Matriz`
Reglas:

- Requiere `_es_matriz_valida(m)`.
- Si no se cumple: lanza `ValueError("La matriz no es válida")`.

Resultado:

- Retorna una matriz donde cada elemento `x` se transforma a `x * escalar`.

### 4) Producto de matrices: `producto_matrices(a: Matriz, b: Matriz) -> Matriz`
Reglas:

- Requiere que `a` y `b` sean válidas (usa `_es_matriz_valida` para ambas).
- Además, exige compatibilidad dimensional:
  - `len(a[0])` (columnas de `a`) debe ser igual a `len(b)` (filas de `b`).
- Si `a` o `b` no son válidas: lanza `ValueError("Alguna de las matrices no es válida")`.
- Si no hay compatibilidad:
  - lanza `ValueError("Número de columnas de A debe ser igual al número de filas de B")`.

Resultado:

- Calcula el producto clásico con triple bucle:
  - `resultado[i][j] = sum_k(a[i][k] * b[k][j])`

### 5) Traspuesta: `traspuesta(m: Matriz) -> Matriz`
Reglas:

- Requiere `_es_matriz_valida(m)`.
- Si no se cumple: lanza `ValueError("La matriz no es válida")`.

Resultado:

- Devuelve `list(fila) for fila in zip(*m)` (transpuesta estándar).

### 6) Determinante: `determinante(m: Matriz) -> float`
Reglas:

1. Requiere `_es_matriz_valida(m)`.
   - Si no se cumple: `ValueError("La matriz no es válida")`.
2. Debe ser cuadrada.
   - Si alguna fila tiene longitud distinta de `n = len(m)`: lanza `ValueError("El determinante sólo existe para matrices cuadradas")`.

Cálculo:

- `n == 1`: retorna `m[0][0]`
- `n == 2`: retorna `m[0][0] * m[1][1] - m[0][1] * m[1][0]`
- `n >= 3`:
  - Expansión por cofactores sobre la primera fila:
    - para cada columna `j`:
      - `signo = -1.0 if j % 2 else 1.0`
      - `det += signo * m[0][j] * determinante(menor(m, 0, j))`

### 7) Subfunción para determinante: `menor(matriz: Matriz, i: int, j: int) -> Matriz`
Genera el **menor** eliminando:

- la fila `i`
- la columna `j`

Se usa internamente por `determinante()` cuando `n >= 3`.

## Entrada por consola (CLI)

### `matriz_desde_entrada(nombre: str = "Matriz") -> Matriz`
Solicita una matriz mediante prompts, validando:

1. Pide número de filas (`filas`) y columnas (`cols`) como enteros:
   - Si `filas <= 0` o `cols <= 0`:
     - imprime `Las filas y columnas deben ser mayores que 0.`
     - repite el input
   - Si el usuario ingresa algo que no es entero:
     - imprime `Ingresa números enteros válidos para filas y columnas.`
     - repite el input
2. Luego pide `filas` líneas, una por fila:
   - Si una fila no tiene exactamente `cols` valores:
     - imprime `Debe tener exactamente {cols} valores. Intenta de nuevo.`
     - repite esa fila
   - Si hay tokens que no se pueden convertir a `float`:
     - imprime `Ingrese solo números válidos.`
     - repite esa fila

Devuelve la matriz como `List[List[float]]`.

### `menu() -> None`
Imprime el menú:

- `1) Sumar matrices`
- `2) Restar matrices`
- `3) Producto escalar`
- `4) Producto de matrices`
- `5) Trasponer`
- `6) Determinante (cuadrada)`
- `7) Salir`

### `main() -> None`
Flujo principal:

1. En un bucle:
   - imprime `menu()`
   - pide `opcion = input("Elige una opción: ").strip()`
2. Según la opción:
   - `1`: pide `A` y `B`, calcula `suma_matrices(A, B)`
   - `2`: pide `A` y `B`, calcula `resta_matrices(A, B)`
   - `3`: pide `A` y un `k` (`float`), calcula `producto_escalar(A, k)`
   - `4`: pide `A` y `B`, calcula `producto_matrices(A, B)`
   - `5`: pide `A`, calcula `traspuesta(A)`
   - `6`: pide `A`, calcula `determinante(A)` (cuadrada)
   - `7`: imprime `Hasta luego!` y sale del bucle
   - cualquier otro: imprime `Opción no válida.`
3. Si ocurre `ValueError` en cualquier operación:
   - imprime `Error: <mensaje>`

## Complejidad y limitaciones relevantes

- Las operaciones de suma/resta/escala/traspuesta y el producto de matrices tienen complejidad polinómica.
- `determinante()` usa una recursión por menores (expansión por cofactores), lo cual crece muy rápido con `n` (puede volverse inusable para matrices medianas/grandes).
- El CLI valida “rectangularidad” pero no impone un límite de tamaño.

## Propuesta: Backend API (FastAPI) con contrato JSON

La forma más directa de “webificar” este módulo es:

1. Mantener la lógica de operaciones (`suma_matrices`, `resta_matrices`, etc.) igual.
2. Envolverlas con endpoints HTTP que:
   - reciban `matrix` en JSON
   - llamen a la función correspondiente
   - conviertan `ValueError` a `HTTP 400`

### Esquema de datos común

- Matriz en JSON: `number[][]`
  - Ejemplo: `[[1, 2], [3, 4]]`
  - Se asume rectangular; si no lo es o si hay incompatibilidad dimensional, el backend responde error.

### Endpoints sugeridos

`POST /api/suma`
- Request:
  - `{ "m1": [[...]], "m2": [[...]] }`
- Response:
  - `{ "result": [[...]] }`

`POST /api/resta`
- Request:
  - `{ "m1": [[...]], "m2": [[...]] }`
- Response:
  - `{ "result": [[...]] }`

`POST /api/escalar`
- Request:
  - `{ "m": [[...]], "escalar": 2.5 }`
- Response:
  - `{ "result": [[...]] }`

`POST /api/multiplicar`
- Request:
  - `{ "a": [[...]], "b": [[...]] }`
- Response:
  - `{ "result": [[...]] }`

`POST /api/trasponer`
- Request:
  - `{ "m": [[...]] }`
- Response:
  - `{ "result": [[...]] }`

`POST /api/determinante`
- Request:
  - `{ "m": [[...]] }`
- Response:
  - `{ "det": 3.0 }`

### Respuestas de error (recomendadas)

Si el backend detecta `ValueError`:

- Status: `400 Bad Request`
- Body:
  - `{ "error": "mensaje del ValueError" }`

Ejemplos de mensajes posibles (derivados del código):

- `Las matrices deben tener la misma dimensión para sumar`
- `Número de columnas de A debe ser igual al número de filas de B`
- `El determinante sólo existe para matrices cuadradas`

## Propuesta: Frontend Web (React) para consumir la API

### Objetivo de UX

Una interfaz simple para que el usuario:

- elija la operación
- ingrese una o dos matrices (según aplique) y, si corresponde, un escalar
- presione “Calcular”
- vea el resultado en una tabla (o número para determinante)
- vea errores claros cuando las dimensiones no coinciden

### Interacción propuesta para el ingreso de matrices

Para mantenerlo simple y alineado con el contrato del backend, se sugiere que el usuario pegue **directamente JSON** con formato `number[][]` en un `textarea`.

Cada matriz se ingresa como un arreglo de arreglos:

Ejemplo (matriz 2x2):

```json
[[1, 2], [3, 4]]
```

Validación esperada en el frontend (opcional pero recomendable):

- `JSON.parse` debe funcionar
- el resultado debe ser `Array<Array<number>>`
- todas las filas deben tener la misma longitud (rectangularidad) antes de llamar al backend

Según la operación:

- `Suma/Resta/Producto de matrices` => textarea para `A` y `B`
- `Producto escalar` => textarea para `A` y un input numérico para `escalar`
- `Trasponer/Determinante` => textarea solo para `A` (en ambos casos se enviará como `m`)

### Pantallas/componentes mínimos

1. Selector de operación
   - `Suma`, `Resta`, `Producto escalar`, `Producto de matrices`, `Trasponer`, `Determinante`
2. Inputs dinámicos según operación
   - Para `Suma/Resta/Producto de matrices`: inputs `A` y `B`
   - Para `Producto escalar`: input `A` + input numérico `escalar`
   - Para `Trasponer`/`Determinante`: input `A` solamente
3. Botón `Calcular`
   - hace `fetch()`/`axios` al endpoint correspondiente
4. Resultado
   - si es matriz: renderizar tabla HTML
   - si es determinante: mostrar un `<h2>` o `<div>` con el valor
5. Manejo de errores
   - mostrar `error` proveniente del backend en una zona visible

### Diagrama Mermaid (UI -> API -> lógica)

```mermaid
flowchart LR
  UI[Frontend React] --> APIGW[Backend API (FastAPI)]
  APIGW --> LOGIC[matrices.py (funciones)]
  LOGIC --> APIGW
  APIGW --> UI
```

### Ejemplos de request/response (para el frontend)

`POST /api/suma`

- Request:
```json
{
  "m1": [[1, 2], [3, 4]],
  "m2": [[5, 6], [7, 8]]
}
```
- Response:
```json
{
  "result": [[6, 8], [10, 12]]
}
```

`POST /api/determinante`

- Request:
```json
{
  "m": [[1, 2], [3, 4]]
}
```
- Response:
```json
{
  "det": -2.0
}
```

## Siguientes pasos recomendados (fuera del alcance de este documento)

- Implementar el backend FastAPI con los endpoints propuestos (mapeando `ValueError` a `400`).
- Crear la app React:
  - componentes de input tipo “matriz como JSON”
  - render de tabla
  - manejo de loading/errores
- (Opcional) Agregar límites de tamaño para proteger el rendimiento de `determinante()` en el frontend/backend.

