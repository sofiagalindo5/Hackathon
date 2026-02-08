from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.auth_routes import router as auth_router
from backend.routes.class_routes import router as class_router
from backend.routes.notes_routes import router as notes_router
from backend.routes.summary_routes import router as summary_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "Backend running"}

app.include_router(auth_router, prefix="/api")
app.include_router(class_router, prefix="/api")
app.include_router(notes_router, prefix="/api")
app.include_router(summary_router, prefix="/api")

