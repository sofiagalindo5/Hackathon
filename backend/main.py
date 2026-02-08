from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes import class_routes, notes_routes, summary_routes

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

app.include_router(auth_router, prefix="/auth")
app.include_router(class_routes.router)
app.include_router(notes_routes.router)
app.include_router(summary_routes.router)
