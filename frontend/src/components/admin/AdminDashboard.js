import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STAT_CARDS = [
    { key: 'totalProducts',  label: 'Total Products',  icon: '📦', color: '#3b82f6' },
    { key: 'totalOrders',    label: 'Total Orders',    icon: '🛒', color: '#8b5cf6' },
    { key: 'activeOrders',   label: 'Active Orders',   icon: '🚚', color: '#f59e0b' },
    { key: 'deliveredOrders',label: 'Delivered',       icon: '✅', color: '#10b981' },
    { key: 'totalRevenue',   label: 'Total Revenue',   icon: '💰', color: '#ef4444', prefix: '$' },
    { key: 'totalCustomers', label: 'Customers',       icon: '👥', color: '#6366f1' },
];

const STATUS_COLORS = {
    placed:    { bg: '#eff6ff', text: '#1d4ed8' },
    packed:    { bg: '#fefce8', text: '#854d0e' },
    shipped:   { bg: '#f5f3ff', text: '#6d28d9' },
    delivered: { bg: '#f0fdf4', text: '#15803d' },
    cancelled: { bg: '#fef2f2', text: '#b91c1c' },
};

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const headers = { 'Content-Type': 'application/json', authorization: token };

        Promise.all([
            fetch('http://localhost:8080/admin-api/stats', { headers }).then(r => r.json()),
            fetch('http://localhost:8080/admin-api/recent-orders', { headers }).then(r => r.json()),
        ]).then(([statsData, ordersData]) => {
            if (statsData.success) setStats(statsData.data);
            if (ordersData.success) setRecentOrders(ordersData.data);
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading dashboard...</p>;

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>Dashboard</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Your store at a glance</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {STAT_CARDS.map(card => (
                    <div key={card.key} style={statCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                                    {card.label}
                                </p>
                                <p style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '6px 0 0' }}>
                                    {card.prefix || ''}{stats ? stats[card.key]?.toLocaleString() : '—'}
                                </p>
                            </div>
                            <span style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                backgroundColor: card.color + '18',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                {card.icon}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div style={tableContainerStyle}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>Recent Orders</h2>
                    <button onClick={() => navigate('/admin/orders')} style={viewAllBtnStyle}>
                        View All →
                    </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb' }}>
                                {['Order ID', 'Customer', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, i) => {
                                const s = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.placed;
                                return (
                                    <tr
                                        key={order._id}
                                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                                        style={{ ...trStyle, backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa', cursor: 'pointer' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#fff' : '#fafafa'}
                                    >
                                        <td style={tdStyle}>
                                            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                                                ...{order._id.slice(-8)}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>{order.user?.email || '—'}</td>
                                        <td style={{ ...tdStyle, fontWeight: '600', color: '#111827' }}>${order.amount}</td>
                                        <td style={tdStyle}>{order.paymentMethod}</td>
                                        <td style={tdStyle}>
                                            <span style={{ backgroundColor: s.bg, color: s.text, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, color: '#6b7280' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                );
                            })}
                            {recentOrders.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '14px' }}>No orders yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const statCardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px 22px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const tableContainerStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflow: 'hidden',
};

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '14px 16px', fontSize: '14px', color: '#374151', borderTop: '1px solid #f3f4f6' };
const trStyle  = { transition: 'background-color 0.1s' };

const viewAllBtnStyle = {
    background: 'none', border: '1px solid #e5e7eb', color: '#374151',
    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500', transition: 'all 0.15s',
};

export default AdminDashboard;
