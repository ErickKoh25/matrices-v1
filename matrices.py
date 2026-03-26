from typing import List

Matriz = List[List[float]]


def imprimir_matriz(matriz: Matriz) -> None:
    """Imprime una matriz fila por fila."""
    for fila in matriz:
        print("\t".join(str(x) for x in fila))


def _es_matriz_valida(m: Matriz) -> bool:
    """Comprueba que la matriz no esté vacía y sea rectangular."""
    if not m:
        return False
    ancho = len(m[0])
    return all(len(fila) == ancho for fila in m)


def son_misma_dim(m1: Matriz, m2: Matriz) -> bool:
    """Comprueba que dos matrices tengan mismas dimensiones."""
    if not (_es_matriz_valida(m1) and _es_matriz_valida(m2)):
        return False
    return len(m1) == len(m2) and len(m1[0]) == len(m2[0])


def suma_matrices(m1: Matriz, m2: Matriz) -> Matriz:
    if not son_misma_dim(m1, m2):
        raise ValueError("Las matrices deben tener la misma dimensión para sumar")
    filas, cols = len(m1), len(m1[0])
    return [[m1[i][j] + m2[i][j] for j in range(cols)] for i in range(filas)]


def resta_matrices(m1: Matriz, m2: Matriz) -> Matriz:
    if not son_misma_dim(m1, m2):
        raise ValueError("Las matrices deben tener la misma dimensión para restar")
    filas, cols = len(m1), len(m1[0])
    return [[m1[i][j] - m2[i][j] for j in range(cols)] for i in range(filas)]


def producto_escalar(m: Matriz, escalar: float) -> Matriz:
    if not _es_matriz_valida(m):
        raise ValueError("La matriz no es válida")
    return [[x * escalar for x in fila] for fila in m]


def producto_matrices(a: Matriz, b: Matriz) -> Matriz:
    if not (_es_matriz_valida(a) and _es_matriz_valida(b)):
        raise ValueError("Alguna de las matrices no es válida")
    if len(a[0]) != len(b):
        raise ValueError("Número de columnas de A debe ser igual al número de filas de B")

    filas_a, cols_a = len(a), len(a[0])
    cols_b = len(b[0])
    resultado = [[0.0 for _ in range(cols_b)] for _ in range(filas_a)]

    for i in range(filas_a):
        for k in range(cols_a):
            aik = a[i][k]
            for j in range(cols_b):
                resultado[i][j] += aik * b[k][j]
    return resultado


def traspuesta(m: Matriz) -> Matriz:
    if not _es_matriz_valida(m):
        raise ValueError("La matriz no es válida")
    return [list(fila) for fila in zip(*m)]


def menor(matriz: Matriz, i: int, j: int) -> Matriz:
    """Devuelve el menor de la matriz eliminando fila i y columna j."""
    return [fila[:j] + fila[j + 1:] for k, fila in enumerate(matriz) if k != i]


def determinante(m: Matriz) -> float:
    if not _es_matriz_valida(m):
        raise ValueError("La matriz no es válida")
    n = len(m)
    if any(len(fila) != n for fila in m):
        raise ValueError("El determinante sólo existe para matrices cuadradas")

    if n == 1:
        return m[0][0]
    if n == 2:
        return m[0][0] * m[1][1] - m[0][1] * m[1][0]

    det = 0.0
    for j in range(n):
        signo = -1.0 if j % 2 else 1.0
        det += signo * m[0][j] * determinante(menor(m, 0, j))
    return det


def matriz_desde_entrada(nombre: str = "Matriz") -> Matriz:
    while True:
        try:
            filas = int(input(f"Número de filas para {nombre}: "))
            cols = int(input(f"Número de columnas para {nombre}: "))
            if filas <= 0 or cols <= 0:
                print("Las filas y columnas deben ser mayores que 0.")
                continue
            break
        except ValueError:
            print("Ingresa números enteros válidos para filas y columnas.")

    print(f"Ingresa {filas} filas con {cols} valores separados por espacio:")
    matriz: Matriz = []
    for i in range(filas):
        while True:
            linea = input(f"Fila {i+1}: ").strip().split()
            if len(linea) != cols:
                print(f"Debe tener exactamente {cols} valores. Intenta de nuevo.")
                continue
            try:
                matriz.append([float(x) for x in linea])
                break
            except ValueError:
                print("Ingrese solo números válidos.")
    return matriz


def menu() -> None:
    print("\n==== Operaciones de matrices ====")
    print("1) Sumar matrices")
    print("2) Restar matrices")
    print("3) Producto escalar")
    print("4) Producto de matrices")
    print("5) Trasponer")
    print("6) Determinante (cuadrada)")
    print("7) Salir")


def main() -> None:
    while True:
        menu()
        opcion = input("Elige una opción: ").strip()

        try:
            if opcion == "1":
                A = matriz_desde_entrada("A")
                B = matriz_desde_entrada("B")
                C = suma_matrices(A, B)
                print("Resultado suma:")
                imprimir_matriz(C)
            elif opcion == "2":
                A = matriz_desde_entrada("A")
                B = matriz_desde_entrada("B")
                C = resta_matrices(A, B)
                print("Resultado resta:")
                imprimir_matriz(C)
            elif opcion == "3":
                A = matriz_desde_entrada("A")
                k = float(input("Escalar: "))
                C = producto_escalar(A, k)
                print("Resultado producto escalar:")
                imprimir_matriz(C)
            elif opcion == "4":
                A = matriz_desde_entrada("A")
                B = matriz_desde_entrada("B")
                C = producto_matrices(A, B)
                print("Resultado producto de matrices:")
                imprimir_matriz(C)
            elif opcion == "5":
                A = matriz_desde_entrada("A")
                C = traspuesta(A)
                print("Matriz traspuesta:")
                imprimir_matriz(C)
            elif opcion == "6":
                A = matriz_desde_entrada("A")
                det = determinante(A)
                print(f"Determinante: {det}")
            elif opcion == "7":
                print("Hasta luego!")
                break
            else:
                print("Opción no válida.")
        except ValueError as e:
            print("Error:", e)


if __name__ == "__main__":
    main()