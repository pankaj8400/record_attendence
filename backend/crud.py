from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Employee, Attendance
from schemas import EmployeeCreate, AttendanceCreate
from datetime import date
from typing import Optional


# --- Employee CRUD ---


def get_employees(db: Session):
    return db.query(Employee).all()


def get_employee_by_employee_id(db: Session, employee_id: str):
    return db.query(Employee).filter(Employee.employee_id == employee_id).first()


def get_employee_by_email(db: Session, email: str):
    return db.query(Employee).filter(Employee.email == email).first()


def create_employee(db: Session, employee: EmployeeCreate):
    db_employee = Employee(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department,
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


def delete_employee(db: Session, employee_id: str):
    db_employee = (
        db.query(Employee).filter(Employee.employee_id == employee_id).first()
    )
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return True
    return False


# --- Attendance CRUD ---


def get_attendance_by_employee(
    db: Session, employee_id: str, filter_date: Optional[date] = None
):
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    if filter_date:
        query = query.filter(Attendance.date == filter_date)
    return query.order_by(Attendance.date.desc()).all()


def get_all_attendance(db: Session, filter_date: Optional[date] = None):
    query = db.query(Attendance)
    if filter_date:
        query = query.filter(Attendance.date == filter_date)
    return query.order_by(Attendance.date.desc()).all()


def get_attendance_record(db: Session, employee_id: str, record_date: date):
    return (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee_id, Attendance.date == record_date
        )
        .first()
    )


def mark_attendance(db: Session, attendance: AttendanceCreate):
    # Check if record already exists for this employee on this date
    existing = get_attendance_record(db, attendance.employee_id, attendance.date)
    if existing:
        # Update existing record
        existing.status = attendance.status.value
        db.commit()
        db.refresh(existing)
        return existing
    else:
        db_attendance = Attendance(
            employee_id=attendance.employee_id,
            date=attendance.date,
            status=attendance.status.value,
        )
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance


def get_present_count(db: Session, employee_id: str):
    return (
        db.query(func.count(Attendance.id))
        .filter(
            Attendance.employee_id == employee_id, Attendance.status == "Present"
        )
        .scalar()
    )


def get_dashboard_stats(db: Session):
    total_employees = db.query(func.count(Employee.id)).scalar()
    total_present_today = (
        db.query(func.count(Attendance.id))
        .filter(
            Attendance.date == date.today(),
            Attendance.status == "Present",
        )
        .scalar()
    )
    total_absent_today = (
        db.query(func.count(Attendance.id))
        .filter(
            Attendance.date == date.today(),
            Attendance.status == "Absent",
        )
        .scalar()
    )
    return {
        "total_employees": total_employees,
        "present_today": total_present_today,
        "absent_today": total_absent_today,
    }
