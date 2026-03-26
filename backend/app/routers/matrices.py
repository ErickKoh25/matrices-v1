from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas.matrices import (
    DeterminantRequest,
    EscalarRequest,
    Matrix2Request,
    MatrixRequest,
    ProductRequest,
)
from app.logic.matrices_adapter import (
    determinante,
    producto_escalar,
    producto_matrices,
    resta_matrices,
    suma_matrices,
    traspuesta,
)

router = APIRouter(prefix="/api", tags=["matrices"])


@router.post("/suma")
def suma(payload: Matrix2Request):
    try:
        return {"result": suma_matrices(payload.m1, payload.m2)}
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.post("/resta")
def resta(payload: Matrix2Request):
    try:
        return {"result": resta_matrices(payload.m1, payload.m2)}
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.post("/escalar")
def escalar(payload: EscalarRequest):
    try:
        return {"result": producto_escalar(payload.m, payload.escalar)}
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.post("/multiplicar")
def multiplicar(payload: ProductRequest):
    try:
        return {"result": producto_matrices(payload.a, payload.b)}
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.post("/trasponer")
def trasponer(payload: MatrixRequest):
    try:
        return {"result": traspuesta(payload.m)}
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.post("/determinante")
def determinante_endpoint(payload: DeterminantRequest):
    try:
        return {"det": determinante(payload.m)}
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

