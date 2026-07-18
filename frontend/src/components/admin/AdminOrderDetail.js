import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const ORDER_STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'];

const TIMELINE_STEPS = ['placed', 'packed', 'shipped', 'delivered'];

const STATUS_COLORS = {
    placed:    { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
    packed:    { bg: '#fefce8', text: '#854d0e', dot: '#f59e0b' },
    shipped:   { bg: '#f5f3ff', text: '#6d28d9', dot: '#8b5cf6' },
    delivered: { bg: '#f0fdf4', text: '#15803d', dot: '#10b981' },
    cancelled: { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444' },
};

function AdminOrderDetail() {
    const { id }    = useParams();
    const navigate  = useNavigate();
    const token     = localStorage.getItem('auth-token');

    const [order,    setOrder]    = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [newStatus, setNewStatus] = useState('');
    const [saving,   setSaving]   = useState(false);
    const [saved,    setSaved]    = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/admin-api/orders/${id}`, {
            headers: { authorization: token }
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                setOrder(data.data);
                setNewStatus(data.data.orderStatus);
            }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [id, token]);

    const handleStatusSave = async () => {
        setSaving(true); setSaved(false);
        try {
            const res  = await fetch(`${API_BASE_URL}/admin-api/orders/${id}/status`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json', authorization: token },
                body:    JSON.stringify({ orderStatus: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setOrder(prev => ({ ...prev, orderStatus: newStatus }));
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    if (loading) return <p style={{ color: '#6b7280' }}>Loading order…</p>;
    if (!order)  return <p style={{ color: '#dc2626' }}>Order not found.</p>;

    const sc = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.placed;
    const cancelledOrder = order.orderStatus === 'cancelled';

    // Timeline: which step index is the current one
    const currentStepIdx = TIMELINE_STEPS.indexOf(order.orderStatus);

    return (
        <div className="w-full max-w-[860px]">
            {/* Header */}
            <div className="mb-7 flex flex-wrap items-center gap-3">
                <button onClick={() => navigate('/admin/orders')} style={backBtnStyle}>← Orders</button>
                <div className="min-w-0 flex-1">
                    <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>Order Detail</h1>
                    <p className="truncate" style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0', fontFamily: 'monospace' }}>{order._id}</p>
                </div>
                <span style={{ backgroundColor: sc.bg, color: sc.text, padding: '5px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', textTransform: 'capitalize' }}>
                    {order.orderStatus}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Products */}
                    <div style={cardStyle}>
                        <h2 style={cardTitleStyle}>Products Ordered</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {order.products.map((item, idx) => {
                                if (!item.product) return null;
                                return (
                                    <div key={idx} className="flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap" style={{ borderBottom: idx < order.products.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                        <img
                                            src={item.product.image?.[0]}
                                            alt={item.product.name}
                                            style={{ width: '52px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb', flexShrink: 0 }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="break-words" style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px' }}>{item.product.name}</p>
                                            <div className="flex flex-wrap gap-x-3 gap-y-1" style={{ fontSize: '12px', color: '#6b7280' }}>
                                                <span>Size: <strong style={{ color: '#374151' }}>{item.size}</strong></span>
                                                <span>Qty: <strong style={{ color: '#374151' }}>{item.quantity}</strong></span>
                                                <span>Price: <strong style={{ color: '#374151' }}>${item.product.price}</strong></span>
                                            </div>
                                        </div>
                                        <p className="ml-auto" style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Total</span>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>${order.amount}</span>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    {!cancelledOrder && (
                        <div style={cardStyle}>
                            <h2 style={cardTitleStyle}>Order Timeline</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginTop: '8px' }}>
                                {TIMELINE_STEPS.map((step, idx) => {
                                    const done    = idx <= currentStepIdx;
                                    const active  = idx === currentStepIdx;
                                    const dotColor = done ? '#10b981' : '#e5e7eb';
                                    const lineColor = idx < currentStepIdx ? '#10b981' : '#e5e7eb';
                                    return (
                                        <React.Fragment key={step}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    backgroundColor: dotColor,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: active ? '3px solid #059669' : `2px solid ${dotColor}`,
                                                    boxShadow: active ? '0 0 0 3px #d1fae5' : 'none',
                                                    flexShrink: 0,
                                                }}>
                                                    {done && <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>✓</span>}
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: active ? '700' : '500', color: done ? '#111827' : '#9ca3af', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                                                    {step}
                                                </span>
                                            </div>
                                            {idx < TIMELINE_STEPS.length - 1 && (
                                                <div style={{ flex: 1, height: '2px', backgroundColor: lineColor, marginBottom: '20px' }} />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Customer Info */}
                    <div style={cardStyle}>
                        <h2 style={cardTitleStyle}>Customer</h2>
                        <InfoRow label="Email"    value={order.user?.email || '—'} />
                        {order.shippingAddress && <>
                            <InfoRow label="Name"    value={order.shippingAddress.fullName} />
                            <InfoRow label="Phone"   value={order.shippingAddress.phone} />
                            <InfoRow label="Address" value={`${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}`} />
                            <InfoRow label="City"    value={`${order.shippingAddress.city}, ${order.shippingAddress.state}`} />
                            <InfoRow label="Pincode" value={order.shippingAddress.pincode} />
                        </>}
                    </div>

                    {/* Payment Info */}
                    <div style={cardStyle}>
                        <h2 style={cardTitleStyle}>Payment</h2>
                        <InfoRow label="Method" value={order.paymentMethod} />
                        <InfoRow label="Status" value={
                            <span style={{
                                backgroundColor: order.paymentStatus === 'paid' ? '#f0fdf4' : '#fff7ed',
                                color: order.paymentStatus === 'paid' ? '#15803d' : '#b45309',
                                padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: '600'
                            }}>
                                {order.paymentStatus}
                            </span>
                        } />
                        <InfoRow label="Order Date" value={new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
                    </div>

                    {/* Update Status */}
                    <div style={cardStyle}>
                        <h2 style={cardTitleStyle}>Update Status</h2>
                        <select
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value)}
                            style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', fontFamily: 'Outfit, sans-serif', outline: 'none', color: '#111827', width: '100%', marginBottom: '12px' }}
                        >
                            {ORDER_STATUSES.map(s => (
                                <option key={s} value={s} style={{ textTransform: 'capitalize' }}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleStatusSave}
                            disabled={saving || newStatus === order.orderStatus}
                            style={{
                                width: '100%', padding: '10px', backgroundColor: '#111827', color: '#fff',
                                border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '14px',
                                fontWeight: '600', opacity: (saving || newStatus === order.orderStatus) ? 0.5 : 1,
                                fontFamily: 'Outfit, sans-serif', transition: 'opacity 0.15s'
                            }}
                        >
                            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Status'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', padding: '7px 0', borderBottom: '1px solid #f9fafb' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: '13px', color: '#374151', textAlign: 'right', fontWeight: '500' }}>{value}</span>
        </div>
    );
}

const cardStyle     = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const cardTitleStyle = { fontSize: '13px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' };
const backBtnStyle  = { background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', color: '#6b7280', fontFamily: 'Outfit, sans-serif' };

export default AdminOrderDetail;
