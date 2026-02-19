import { useState, useEffect } from 'react';
import { getEmployees, markAttendance, getEmployeeAttendance, getPresentCount } from '../api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { HiOutlineClipboardCheck, HiOutlineEye } from 'react-icons/hi';

function Attendance({ addToast }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Mark attendance state
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceStatus, setAttendanceStatus] = useState('Present');
    const [markLoading, setMarkLoading] = useState(false);

    // View records state
    const [viewEmployee, setViewEmployee] = useState(null);
    const [records, setRecords] = useState([]);
    const [recordsLoading, setRecordsLoading] = useState(false);
    const [presentCount, setPresentCount] = useState(0);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await getEmployees();
            setEmployees(res.data);
            setError('');
        } catch (err) {
            setError('Failed to load employees. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!selectedEmployee || !attendanceDate) {
            addToast('Please select employee and date.', 'error');
            return;
        }

        setMarkLoading(true);
        try {
            await markAttendance({
                employee_id: selectedEmployee,
                date: attendanceDate,
                status: attendanceStatus,
            });
            addToast(`Attendance marked as ${attendanceStatus} for ${selectedEmployee}`, 'success');
            // Refresh records if currently viewing this employee
            if (viewEmployee === selectedEmployee) {
                fetchRecords(selectedEmployee);
            }
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to mark attendance.';
            addToast(msg, 'error');
        } finally {
            setMarkLoading(false);
        }
    };

    const fetchRecords = async (empId) => {
        setRecordsLoading(true);
        setViewEmployee(empId);
        try {
            const [recRes, countRes] = await Promise.all([
                getEmployeeAttendance(empId, filterDate || undefined),
                getPresentCount(empId),
            ]);
            setRecords(recRes.data);
            setPresentCount(countRes.data.present_days);
        } catch (err) {
            addToast('Failed to fetch attendance records.', 'error');
        } finally {
            setRecordsLoading(false);
        }
    };

    const handleFilterChange = (value) => {
        setFilterDate(value);
    };

    const applyFilter = () => {
        if (viewEmployee) {
            fetchRecords(viewEmployee);
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <div className="page-header">
                <h2>Attendance</h2>
                <p>Mark and track employee attendance</p>
            </div>

            {error && <div className="error-banner">⚠ {error}</div>}

            {employees.length === 0 ? (
                <EmptyState
                    icon="📋"
                    title="No employees available"
                    message="Add employees first to start tracking attendance."
                />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    {/* Mark Attendance Card */}
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <HiOutlineClipboardCheck style={{ color: 'var(--accent)' }} /> Mark Attendance
                        </h3>
                        <form onSubmit={handleMarkAttendance}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="att-employee">Employee</label>
                                    <select
                                        id="att-employee"
                                        className="form-input form-select"
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                    >
                                        <option value="">Select an employee</option>
                                        {employees.map((emp) => (
                                            <option key={emp.employee_id} value={emp.employee_id}>
                                                {emp.employee_id} — {emp.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="att-date">Date</label>
                                    <input
                                        id="att-date"
                                        className="form-input"
                                        type="date"
                                        value={attendanceDate}
                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="att-status">Status</label>
                                    <select
                                        id="att-status"
                                        className="form-input form-select"
                                        value={attendanceStatus}
                                        onChange={(e) => setAttendanceStatus(e.target.value)}
                                    >
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={markLoading} style={{ marginTop: 4 }}>
                                    {markLoading ? 'Marking...' : 'Mark Attendance'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Employee List for Viewing Records */}
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <HiOutlineEye style={{ color: 'var(--accent)' }} /> View Records
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {employees.map((emp) => (
                                <button
                                    key={emp.employee_id}
                                    className={`btn ${viewEmployee === emp.employee_id ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                                    onClick={() => fetchRecords(emp.employee_id)}
                                >
                                    <span style={{ fontWeight: 600 }}>{emp.employee_id}</span>
                                    <span style={{ opacity: 0.7 }}>— {emp.full_name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Records Table */}
            {viewEmployee && (
                <div className="card" style={{ marginTop: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                                Records for {viewEmployee}
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                                Total present days: <span style={{ color: 'var(--success)', fontWeight: 700 }}>{presentCount}</span>
                            </p>
                        </div>
                        <div className="filter-bar" style={{ marginBottom: 0 }}>
                            <input
                                className="form-input"
                                type="date"
                                value={filterDate}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                style={{ maxWidth: 180 }}
                            />
                            <button className="btn btn-secondary btn-sm" onClick={applyFilter}>Filter</button>
                            {filterDate && (
                                <button className="btn btn-secondary btn-sm" onClick={() => { setFilterDate(''); setTimeout(() => fetchRecords(viewEmployee), 100); }}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {recordsLoading ? (
                        <Loader />
                    ) : records.length === 0 ? (
                        <EmptyState
                            icon="📅"
                            title="No records found"
                            message="No attendance records exist for this employee."
                        />
                    ) : (
                        <div className="table-container" style={{ border: 'none' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((rec) => (
                                        <tr key={rec.id}>
                                            <td>{new Date(rec.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td>
                                                <span className={`badge ${rec.status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                                                    {rec.status === 'Present' ? '✓' : '✕'} {rec.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Attendance;
