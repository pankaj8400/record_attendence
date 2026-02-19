from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from database import get_db
import crud
from schemas import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    # Verify employee exists
    employee = crud.get_employee_by_employee_id(db, attendance.employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance.employee_id}' not found",
        )

    # Validate status
    if attendance.status.value not in ["Present", "Absent"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'Present' or 'Absent'",
        )

    result = crud.mark_attendance(db, attendance)
    return result


@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
def get_employee_attendance(
    employee_id: str,
    filter_date: Optional[date] = Query(None, alias="date"),
    db: Session = Depends(get_db),
):
    # Verify employee exists
    employee = crud.get_employee_by_employee_id(db, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found",
        )

    return crud.get_attendance_by_employee(db, employee_id, filter_date)


@router.get("/", response_model=List[AttendanceResponse])
def get_all_attendance(
    filter_date: Optional[date] = Query(None, alias="date"),
    db: Session = Depends(get_db),
):
    return crud.get_all_attendance(db, filter_date)


@router.get("/present-count/{employee_id}")
def get_present_days(employee_id: str, db: Session = Depends(get_db)):
    employee = crud.get_employee_by_employee_id(db, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found",
        )
    count = crud.get_present_count(db, employee_id)
    return {"employee_id": employee_id, "present_days": count}
