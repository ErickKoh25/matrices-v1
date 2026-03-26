"""
Adaptador para exponer las funciones de `matrices.py` como lógica importable desde el backend.

`matrices.py` vive en la raíz del repo; aquí ajustamos `sys.path` para poder importarlo sin
refactorizar el archivo original.
"""

from __future__ import annotations

import sys
from pathlib import Path

# backend/app/logic/matrices_adapter.py -> repo root es 3 niveles arriba.
REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.append(str(REPO_ROOT))

# Importar el módulo original.
from matrices import (  # type: ignore
    determinante as _determinante,
    producto_escalar as _producto_escalar,
    producto_matrices as _producto_matrices,
    resta_matrices as _resta_matrices,
    suma_matrices as _suma_matrices,
    traspuesta as _traspuesta,
)


def suma_matrices(m1, m2):
    return _suma_matrices(m1, m2)


def resta_matrices(m1, m2):
    return _resta_matrices(m1, m2)


def producto_escalar(m, escalar):
    return _producto_escalar(m, escalar)


def producto_matrices(a, b):
    return _producto_matrices(a, b)


def traspuesta(m):
    return _traspuesta(m)


def determinante(m):
    return _determinante(m)

