import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

function Employees({ addToast }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });

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
            setError('Failed to fetch employees. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Client-side validation
        if (!form.employee_id.trim() || !form.full_name.trim() || !form.email.trim() || !form.department.trim()) {
            setFormError('All fields are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setFormError('Please enter a valid email address.');
            return;
        }

        setSubmitting(true);
        try {
            await createEmployee(form);
            addToast('Employee added successfully!', 'success');
            setShowModal(false);
            setForm({ employee_id: '', full_name: '', email: '', department: '' });
            fetchEmployees();
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to add employee.';
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteEmployee(deleteTarget);
            addToast('Employee deleted successfully.', 'success');
            setDeleteTarget(null);
            fetchEmployees();
        } catch (err) {
            addToast('Failed to delete employee.', 'error');
            setDeleteTarget(null);
        }
    };

    return (
        <>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h2>Employees</h2>
                        <p>Manage your workforce records</p>
                    </div>
                    <button id="add-employee-btn" className="btn btn-primary" onClick={() => { setShowModal(true); setFormError(''); }}>
                        <HiOutlinePlus /> Add Employee
                    </button>
                </div>
            </div>

            {error && <div className="error-banner">⚠ {error}</div>}

            {loading ? (
                <Loader />
            ) : employees.length === 0 ? (
                <EmptyState
                    icon="👥"
                    title="No employees yet"
                    message="Get started by adding your first employee."
                />
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th style={{ width: 80 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.employee_id}>
                                    <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{emp.employee_id}</td>
                                    <td>{emp.full_name}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
                                    <td><span className="badge badge-dept">{emp.department}</span></td>
                                    <td>
                                        <button
                                            id={`delete-${emp.employee_id}`}
                                            className="btn btn-danger btn-icon btn-sm"
                                            title="Delete employee"
                                            onClick={() => setDeleteTarget(emp.employee_id)}
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Employee Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Employee</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        {formError && <div className="error-banner">⚠ {formError}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="employee_id">Employee ID</label>
                                    <input
                                        id="employee_id"
                                        className="form-input"
                                        type="text"
                                        name="employee_id"
                                        placeholder="e.g. EMP001"
                                        value={form.employee_id}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="full_name">Full Name</label>
                                    <input
                                        id="full_name"
                                        className="form-input"
                                        type="text"
                                        name="full_name"
                                        placeholder="John Doe"
                                        value={form.full_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        className="form-input"
                                        type="email"
                                        name="email"
                                        placeholder="john@company.com"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="department">Department</label>
                                    <input
                                        id="department"
                                        className="form-input"
                                        type="text"
                                        name="department"
                                        placeholder="Engineering"
                                        value={form.department}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-actions" style={{ marginTop: 24 }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Adding...' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteTarget && (
                <ConfirmDialog
                    title="Delete Employee"
                    message={`Are you sure you want to delete employee "${deleteTarget}"? This will also remove all their attendance records. This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </>
    );
}

export default Employees;
