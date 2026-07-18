import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const ORDER_STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
    placed:    { bg: '#eff6ff', text: '#1d4ed8' },
    packed:    { bg: '#fefce8', text: '#854d0e' },
    shipped:   { bg: '#f5f3ff', text: '#6d28d9' },
    delivered: { bg: '#f0fdf4', text: '#15803d' },
    cancelled: { bg: '#fef2f2', text: '#b91c1c' },
};

function AdminOrders() {
    const navigate = useNavigate();
    const token    = localStorage.getItem('auth-token');

    const [orders, setOrders]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [updating, setUpdating] = useState(null); // order _id being updated

    useEffect(() => {
        fetch(`${API_BASE_URL}/admin-api/orders`, {
            headers: { authorization: token }
        })
        .then(r => r.json())
        .then(data => { if (data.success) setOrders(data.data); })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [token]);

    const updateStatus = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            const res  = await fetch(`${API_BASE_URL}/admin-api/orders/${orderId}/status`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json', authorization: token },
                body:    JSON.stringify({ orderStatus: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setOrders(prev =>
                    prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o)
                );
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>All Orders</h1>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{orders.length} orders total</p>
            </div>

            <div style={tableContainerStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb' }}>
                                {['Order ID', 'Customer', 'Items', 'Amount', 'Method', 'Payment', 'Status', 'Date', ''].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Loading orders…</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>No orders found</td></tr>
                            ) : orders.map((order, i) => {
                                const s = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.placed;
                                const isUpdating = updating === order._id;
                                return (
                                    <tr
                                        key={order._id}
                                        style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}
                                    >
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                            >
                                                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#2563eb', textDecoration: 'underline' }}>
                                                    ...{order._id.slice(-8)}
                                                </span>
                                            </button>
                                        </td>
                                        <td style={{ ...tdStyle, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {order.user?.email || '—'}
                                        </td>
                                        <td style={tdStyle}>{order.products?.length || 0} item{order.products?.length !== 1 ? 's' : ''}</td>
                                        <td style={{ ...tdStyle, fontWeight: '600', color: '#111827' }}>${order.amount}</td>
                                        <td style={tdStyle}>{order.paymentMethod}</td>
                                        <td style={tdStyle}>
                                            <span style={order.paymentStatus === 'paid'
                                                ? badgeStyle('#f0fdf4', '#15803d')
                                                : badgeStyle('#fff7ed', '#b45309')
                                            }>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <select
                                                value={order.orderStatus}
                                                disabled={isUpdating}
                                                onChange={e => updateStatus(order._id, e.target.value)}
                                                style={{
                                                    padding: '5px 8px', fontSize: '12px', fontWeight: '600',
                                                    backgroundColor: s.bg, color: s.text,
                                                    border: `1px solid ${s.text}40`,
                                                    borderRadius: '999px', cursor: 'pointer',
                                                    fontFamily: 'Outfit, sans-serif', outline: 'none',
                                                    opacity: isUpdating ? 0.6 : 1,
                                                }}
                                            >
                                                {ORDER_STATUSES.map(st => (
                                                    <option key={st} value={st} style={{ backgroundColor: '#fff', color: '#111827' }}>
                                                        {st.charAt(0).toUpperCase() + st.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ ...tdStyle, color: '#6b7280', whiteSpace: 'nowrap' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                style={viewBtnStyle}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const tableContainerStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' };
const thStyle = { padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const tdStyle = { padding: '13px 14px', fontSize: '13px', color: '#374151', borderTop: '1px solid #f3f4f6', verticalAlign: 'middle' };
const badgeStyle = (bg, text) => ({ backgroundColor: bg, color: text, padding: '3px 9px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' });
const viewBtnStyle = { padding: '5px 12px', border: '1px solid #e5e7eb', backgroundColor: '#fff', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: '#374151', transition: 'background-color 0.15s', fontFamily: 'Outfit, sans-serif' };

export default AdminOrders;
