from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import crud
from schemas import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/api/employees", tags=["Employees"])


@router.get("/", response_model=List[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = crud.get_employee_by_employee_id(db, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found",
        )
    return employee


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Check for duplicate employee_id
    existing_by_id = crud.get_employee_by_employee_id(db, employee.employee_id)
    if existing_by_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with ID '{employee.employee_id}' already exists",
        )
    # Check for duplicate email
    existing_by_email = crud.get_employee_by_email(db, employee.email)
    if existing_by_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with email '{employee.email}' already exists",
        )
    return crud.create_employee(db, employee)


@router.delete("/{employee_id}", status_code=status.HTTP_200_OK)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    success = crud.delete_employee(db, employee_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found",
        )
    return {"message": f"Employee '{employee_id}' deleted successfully"}
