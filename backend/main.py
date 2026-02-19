from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
import models
import crud
from routers import employees, attendance

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight Human Resource Management System",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)


@app.get("/")
def root():
    return {"message": "HRMS Lite API is running", "version": "1.0.0"}


@app.get("/api/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)
