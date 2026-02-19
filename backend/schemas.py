from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
from typing import Optional, List
from enum import Enum


class AttendanceStatusEnum(str, Enum):
    PRESENT = "Present"
    ABSENT = "Absent"


# --- Employee Schemas ---


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id")
    @classmethod
    def employee_id_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Employee ID cannot be empty")
        return v.strip()

    @field_validator("full_name")
    @classmethod
    def full_name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Full name cannot be empty")
        return v.strip()

    @field_validator("department")
    @classmethod
    def department_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Department cannot be empty")
        return v.strip()


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str

    class Config:
        from_attributes = True


# --- Attendance Schemas ---


class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatusEnum


class AttendanceResponse(BaseModel):
    id: int
    employee_id: str
    date: date
    status: str

    class Config:
        from_attributes = True


class AttendanceWithEmployee(AttendanceResponse):
    employee_name: Optional[str] = None
