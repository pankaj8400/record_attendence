function Toast({ toasts }) {
    if (!toasts.length) return null;

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    {toast.type === 'success' ? '✓' : '✕'} {toast.message}
                </div>
            ))}
        </div>
    );
}

export default Toast;
