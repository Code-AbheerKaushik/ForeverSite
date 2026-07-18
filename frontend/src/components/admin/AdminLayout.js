import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context';

function AdminLayout() {
    const { userEmail, setUserEmail, setCartNo, setcartarray, setCartTotal } = useContext(CartContext);
    const navigate = useNavigate();
    const [productsOpen, setProductsOpen] = useState(true);
    const [ordersOpen, setOrdersOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem('auth-token');
        setUserEmail(false);
        setCartNo(0);
        setcartarray([]);
        setCartTotal(0);
        navigate('/login');
    };

    // Close sidebar on ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Prevent body scrolling when mobile drawer is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    const renderSidebarContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Brand */}
            <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '0.08em', color: '#ffffff' }}>
                        FOREVERBUY
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px', letterSpacing: '0.05em' }}>
                        ADMIN PANEL
                    </div>
                </div>
                {/* Mobile Drawer Close Button */}
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden text-gray-400 hover:text-white p-1"
                    aria-label="Close menu"
                >
                    ✕
                </button>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                <NavLink
                    to="/admin" end
                    onClick={() => setIsSidebarOpen(false)}
                    style={({ isActive }) => navItemStyle(isActive, false)}
                >
                    <span style={{ fontSize: '14px' }}>⊞</span> Dashboard
                </NavLink>

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
                            <NavLink to="/admin/products" onClick={() => setIsSidebarOpen(false)} style={({ isActive }) => navItemStyle(isActive, true)}>All Products</NavLink>
                            <NavLink to="/admin/products/add" onClick={() => setIsSidebarOpen(false)} style={({ isActive }) => navItemStyle(isActive, true)}>Add Product</NavLink>
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
                            <NavLink to="/admin/orders" onClick={() => setIsSidebarOpen(false)} style={({ isActive }) => navItemStyle(isActive, true)}>All Orders</NavLink>
                        </div>
                    )}
                </div>
            </nav>

            {/* Footer */}
            <div style={{ padding: '16px 12px', borderTop: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280', paddingLeft: '4px', marginBottom: '4px' }}>
                    Logged in as<br />
                    <span style={{ color: '#9ca3af', fontWeight: '500', wordBreak: 'break-all' }}>{userEmail}</span>
                </div>
                <button
                    onClick={() => { setIsSidebarOpen(false); navigate('/'); }}
                    style={footerBtnStyle('#374151')}
                >
                    ← Storefront
                </button>
                <button
                    onClick={logout}
                    style={footerBtnStyle('#7f1d1d')}
                >
                    Log Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100 font-[Outfit]">

            {/* ── Mobile Sidebar Drawer Panel ── */}
            <div 
                className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />
            <aside 
                className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-gray-900 text-white flex flex-col transition-transform duration-300 transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {renderSidebarContent()}
            </aside>

            {/* ── Desktop Sidebar Panel ── */}
            <aside className="hidden md:flex w-60 shrink-0 bg-gray-900 text-white flex-col shadow-lg">
                {renderSidebarContent()}
            </aside>

            {/* ── Main content area ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded mr-2"
                            aria-label="Open menu"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="text-xs sm:text-sm text-gray-500 tracking-wide">
                            FOREVERBUY &nbsp;/&nbsp; <span className="text-gray-900 font-semibold">Admin Panel</span>
                        </span>
                    </div>
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-semibold tracking-wider">
                        ● LIVE
                    </span>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

        </div>
    );
}

// NavItem helper converted to style generator function
const navItemStyle = (isActive, sub) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: sub ? '8px 12px' : '10px 12px',
    borderRadius: '6px',
    fontSize: sub ? '13px' : '14px',
    fontWeight: isActive ? '600' : '400',
    color: isActive ? '#ffffff' : '#9ca3af',
    backgroundColor: isActive ? '#1f2937' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.15s',
    letterSpacing: '0.01em',
});

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
