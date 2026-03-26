from typing import List

from pydantic import BaseModel

Matrix = List[List[float]]


class MatrixRequest(BaseModel):
    m: Matrix


class Matrix2Request(BaseModel):
    m1: Matrix
    m2: Matrix


class EscalarRequest(BaseModel):
    m: Matrix
    escalar: float


class ProductRequest(BaseModel):
    a: Matrix
    b: Matrix


class DeterminantRequest(BaseModel):
    m: Matrix

