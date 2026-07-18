import React, { useEffect, useState } from 'react'

/**
 * Toast Alert
 * Props:
 *  - message  : string
 *  - type     : 'error' | 'success'
 *  - onClose  : () => void
 *  - duration : ms before auto-dismiss (default 4000)
 */
function Alert({ message, type = 'error', onClose, duration = 4000 }) {
    const [visible, setVisible] = useState(false);

    // Slide in after mount
    useEffect(() => {
        const show = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(show);
    }, []);

    // Auto-dismiss
    useEffect(() => {
        const timer = setTimeout(() => handleClose(), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 350); // wait for slide-out before unmounting
    };

    const isSuccess = type === 'success';

    return (
        <div
            style={{
                position: 'fixed',
                top: '1.5rem',
                right: '1.5rem',
                zIndex: 9999,
                minWidth: '300px',
                maxWidth: '420px',
                transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 1.5rem))',
                opacity: visible ? 1 : 0,
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px 16px',
                    background: '#ffffff',
                    border: `1.5px solid ${isSuccess ? '#22c55e' : '#ef4444'}`,
                    borderLeft: `4px solid ${isSuccess ? '#22c55e' : '#ef4444'}`,
                    borderRadius: '2px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
            >
                {/* Icon */}
                <span style={{
                    fontSize: '18px',
                    lineHeight: 1,
                    marginTop: '1px',
                    flexShrink: 0,
                    color: isSuccess ? '#22c55e' : '#ef4444',
                }}>
                    {isSuccess ? '✓' : '✕'}
                </span>

                {/* Message */}
                <p style={{
                    flex: 1,
                    margin: 0,
                    fontSize: '14px',
                    fontFamily: 'Outfit, sans-serif',
                    color: '#374151',
                    lineHeight: '1.5',
                }}>
                    {message}
                </p>

                {/* Close button */}
                <button
                    onClick={handleClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        fontSize: '16px',
                        lineHeight: 1,
                        padding: '0',
                        marginTop: '1px',
                        flexShrink: 0,
                        transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Progress bar */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '2px',
                    background: isSuccess ? '#22c55e' : '#ef4444',
                    opacity: 0.4,
                    borderRadius: '0 0 0 2px',
                    animation: `shrink ${duration}ms linear forwards`,
                    width: '100%',
                }} />
            </div>

            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to   { width: 0%; }
                }
            `}</style>
        </div>
    )
}

export default Alert
