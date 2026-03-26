from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.matrices import router as matrices_router


def create_app() -> FastAPI:
    app = FastAPI(title="Matrices API")

    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ErickKoh25.github.io",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(matrices_router)

    @app.get("/health")
    def health() -> dict:
        return {"ok": True}

    return app


app = create_app()

