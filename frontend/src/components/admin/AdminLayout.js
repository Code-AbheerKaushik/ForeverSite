import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context';

const ADMIN_EMAIL = "abheerkaushik2@gmail.com";

function AdminLayout() {
    const { userEmail, setUserEmail, setCartNo, setcartarray, setCartTotal } = useContext(CartContext);
    const navigate = useNavigate();
    const [productsOpen, setProductsOpen] = useState(true);
    const [ordersOpen, setOrdersOpen] = useState(true);

    const logout = () => {
        localStorage.removeItem('auth-token');
        setUserEmail(false);
        setCartNo(0);
        setcartarray([]);
        setCartTotal(0);
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Outfit, sans-serif', backgroundColor: '#f3f4f6' }}>

            {/* ── Sidebar ───────────────────────────────────────────── */}
            <aside style={{
                width: '240px',
                minWidth: '240px',
                backgroundColor: '#111827',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
                boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
            }}>
                {/* Brand */}
                <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1f2937' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '0.08em', color: '#ffffff' }}>
                        FOREVERBUY
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px', letterSpacing: '0.05em' }}>
                        ADMIN PANEL
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>

                    <NavItem to="/admin" label="Dashboard" icon="⊞" end />

                    {/* Products group */}
                    <div>
                        <button
                            onClick={() => setProductsOpen(o => !o)}
                            style={groupHeaderStyle}
                        >
                            <span>⊡ Products</span>
                            <span style={{ fontSize: '10px', opacity: 0.6 }}>{productsOpen ? '▲' : '▼'}</span>
                        </button>
                        {productsOpen && (
                            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                                <NavItem to="/admin/products" label="All Products" sub />
                                <NavItem to="/admin/products/add" label="Add Product" sub />
                            </div>
                        )}
                    </div>

                    {/* Orders group */}
                    <div>
                        <button
                            onClick={() => setOrdersOpen(o => !o)}
                            style={groupHeaderStyle}
                        >
                            <span>⊟ Orders</span>
                            <span style={{ fontSize: '10px', opacity: 0.6 }}>{ordersOpen ? '▲' : '▼'}</span>
                        </button>
                        {ordersOpen && (
                            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                                <NavItem to="/admin/orders" label="All Orders" sub />
                            </div>
                        )}
                    </div>
                </nav>

                {/* Footer */}
                <div style={{ padding: '16px 12px', borderTop: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', paddingLeft: '4px', marginBottom: '4px' }}>
                        Logged in as<br />
                        <span style={{ color: '#9ca3af', fontWeight: '500' }}>{userEmail}</span>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={footerBtnStyle('#374151')}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4b5563'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#374151'}
                    >
                        ← Storefront
                    </button>
                    <button
                        onClick={logout}
                        style={footerBtnStyle('#7f1d1d')}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#991b1b'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#7f1d1d'}
                    >
                        Log Out
                    </button>
                </div>
            </aside>

            {/* ── Main Area ─────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Top Header */}
                <header style={{
                    height: '60px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 32px',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: '14px', color: '#6b7280', letterSpacing: '0.02em' }}>
                        FOREVERBUY &nbsp;/&nbsp; <span style={{ color: '#111827', fontWeight: '600' }}>Admin Control Centre</span>
                    </span>
                    <span style={{
                        fontSize: '12px',
                        backgroundColor: '#f0fdf4',
                        color: '#15803d',
                        border: '1px solid #bbf7d0',
                        borderRadius: '999px',
                        padding: '3px 10px',
                        fontWeight: '600',
                        letterSpacing: '0.04em'
                    }}>
                        ● LIVE
                    </span>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

// ── Small helpers ──────────────────────────────────────────────────────────
function NavItem({ to, label, icon, sub, end }) {
    return (
        <NavLink
            to={to}
            end={end}
            style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: sub ? '7px 12px' : '9px 12px',
                borderRadius: '6px',
                fontSize: sub ? '13px' : '14px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#ffffff' : '#9ca3af',
                backgroundColor: isActive ? '#1f2937' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
                letterSpacing: '0.01em',
            })}
            onMouseEnter={e => { if (!e.currentTarget.style.backgroundColor.includes('1f2937')) e.currentTarget.style.backgroundColor = '#1a2332'; }}
            onMouseLeave={e => { if (!e.currentTarget.style.fontWeight.includes('600')) e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
            {icon && <span style={{ fontSize: '14px' }}>{icon}</span>}
            {label}
        </NavLink>
    );
}

const groupHeaderStyle = {
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '500',
    padding: '9px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    letterSpacing: '0.01em',
    transition: 'color 0.15s',
};

const footerBtnStyle = (bg) => ({
    width: '100%',
    padding: '9px',
    backgroundColor: bg,
    border: 'none',
    color: '#ffffff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    letterSpacing: '0.02em',
});

export default AdminLayout;
