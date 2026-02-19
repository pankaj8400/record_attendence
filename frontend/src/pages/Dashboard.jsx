import { useState, useEffect } from 'react';
import { getDashboardStats, getEmployees } from '../api';
import Loader from '../components/Loader';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, empRes] = await Promise.all([
                getDashboardStats(),
                getEmployees(),
            ]);
            setStats(statsRes.data);
            setEmployees(empRes.data);
            setError('');
        } catch (err) {
            setError('Failed to load dashboard data. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <>
                <div className="page-header">
                    <h2>Dashboard</h2>
                    <p>Overview of your workforce</p>
                </div>
                <div className="error-banner">⚠ {error}</div>
            </>
        );
    }

    const departments = [...new Set(employees.map((e) => e.department))];

    return (
        <>
            <div className="page-header">
                <h2>Dashboard</h2>
                <p>Overview of your workforce</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">👥</div>
                    <div className="stat-info">
                        <h3>{stats?.total_employees ?? 0}</h3>
                        <p>Total Employees</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">✅</div>
                    <div className="stat-info">
                        <h3>{stats?.present_today ?? 0}</h3>
                        <p>Present Today</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon red">❌</div>
                    <div className="stat-info">
                        <h3>{stats?.absent_today ?? 0}</h3>
                        <p>Absent Today</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon yellow">🏢</div>
                    <div className="stat-info">
                        <h3>{departments.length}</h3>
                        <p>Departments</p>
                    </div>
                </div>
            </div>

            {/* Recent Employees */}
            <div className="card">
                <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 600 }}>Recent Employees</h3>
                {employees.length === 0 ? (
                    <div className="empty-state" style={{ padding: '30px 16px' }}>
                        <p>No employees added yet</p>
                    </div>
                ) : (
                    <div className="table-container" style={{ border: 'none' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.slice(0, 5).map((emp) => (
                                    <tr key={emp.employee_id}>
                                        <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{emp.employee_id}</td>
                                        <td>{emp.full_name}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
                                        <td><span className="badge badge-dept">{emp.department}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default Dashboard;
