import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const CATEGORIES = ['Men', 'Women', 'Kids'];

function AdminProducts() {
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [page, setPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null); // { _id, name }

    const PER_PAGE = 10;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search)    params.set('search', search);
        if (catFilter) params.set('category', catFilter);

        try {
            const res  = await fetch(`${API_BASE_URL}/admin-api/products?${params}`, {
                headers: { authorization: token },
            });
            const data = await res.json();
            if (data.success) setProducts(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, catFilter, token]);

    useEffect(() => {
        const t = setTimeout(fetchProducts, 300);
        return () => clearTimeout(t);
    }, [fetchProducts]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await fetch(`${API_BASE_URL}/admin-api/products/${deleteTarget._id}`, {
                method: 'DELETE',
                headers: { authorization: token },
            });
            setDeleteTarget(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const totalPages = Math.ceil(products.length / PER_PAGE);
    const paginated  = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>All Products</h1>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{products.length} products total</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products/add')}
                    style={primaryBtnStyle}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                    + Add Product
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search by name…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    style={inputStyle}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => { setCatFilter(''); setPage(1); }}
                        style={catFilter === '' ? activePillStyle : pillStyle}
                    >All</button>
                    {CATEGORIES.map(c => (
                        <button key={c}
                            onClick={() => { setCatFilter(c); setPage(1); }}
                            style={catFilter === c ? activePillStyle : pillStyle}
                        >{c}</button>
                    ))}
                </div>
            </div>

            {/* Table / Cards container */}
            <div style={tableContainerStyle}>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb' }}>
                                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading…</td></tr>
                            ) : paginated.length === 0 ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No products found</td></tr>
                            ) : paginated.map((p, i) => {
                                const outOfStock   = p.stock === 0;
                                const lowStock     = p.stock > 0 && p.stock < 10;
                                return (
                                    <tr key={p._id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                                        <td style={tdStyle}>
                                            <img
                                                src={p.image?.[0]}
                                                alt={p.name}
                                                style={{ width: '48px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                                            />
                                        </td>
                                        <td style={{ ...tdStyle, fontWeight: '500', color: '#111827', maxWidth: '200px' }}>
                                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{p.subCategory}</div>
                                        </td>
                                        <td style={tdStyle}>{p.category}</td>
                                        <td style={{ ...tdStyle, fontWeight: '600' }}>${p.price}</td>
                                        <td style={tdStyle}>
                                            {outOfStock ? (
                                                <span style={badgeStyle('#fef2f2', '#b91c1c')}>Out of Stock</span>
                                            ) : lowStock ? (
                                                <span style={badgeStyle('#fffbeb', '#b45309')}>{p.stock} — Low</span>
                                            ) : (
                                                <span style={{ color: '#374151' }}>{p.stock}</span>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={outOfStock ? badgeStyle('#fef2f2', '#b91c1c') : badgeStyle('#f0fdf4', '#15803d')}>
                                                {outOfStock ? 'Inactive' : 'Active'}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                                                    style={editBtnStyle}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget({ _id: p._id, name: p.name })}
                                                    style={deleteBtnStyle}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Stacked Cards */}
                <div className="block md:hidden divide-y divide-gray-150 bg-white">
                    {loading ? (
                        <div className="text-center py-10 text-gray-400">Loading…</div>
                    ) : paginated.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">No products found</div>
                    ) : paginated.map((p) => {
                        const outOfStock   = p.stock === 0;
                        const lowStock     = p.stock > 0 && p.stock < 10;
                        return (
                            <div key={p._id} className="p-4 flex gap-4 items-center justify-between">
                                <div className="flex gap-3 items-center min-w-0">
                                    <img
                                        src={p.image?.[0]}
                                        alt={p.name}
                                        style={{ width: '48px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                                        className="shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{p.category} • {p.subCategory}</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1">${p.price}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2.5 shrink-0">
                                    {outOfStock ? (
                                        <span style={badgeStyle('#fef2f2', '#b91c1c')}>Out of Stock</span>
                                    ) : lowStock ? (
                                        <span style={badgeStyle('#fffbeb', '#b45309')}>{p.stock} — Low</span>
                                    ) : (
                                        <span style={badgeStyle('#f0fdf4', '#15803d')}>{p.stock} Units</span>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                                            style={editBtnStyle}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget({ _id: p._id, name: p.name })}
                                            style={deleteBtnStyle}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', borderTop: '1px solid #f3f4f6' }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={pageBtnStyle(false)}
                        >← Prev</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button key={n} onClick={() => setPage(n)} style={pageBtnStyle(n === page)}>{n}</button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={pageBtnStyle(false)}
                        >Next →</button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Delete Product?</h3>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                style={{ padding: '9px 18px', border: '1px solid #e5e7eb', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{ padding: '9px 18px', backgroundColor: '#dc2626', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Styles ────────────────────────────────────────────────────────
const tableContainerStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' };
const thStyle    = { padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle    = { padding: '12px 16px', fontSize: '14px', color: '#374151', borderTop: '1px solid #f3f4f6', verticalAlign: 'middle' };
const inputStyle = { padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', outline: 'none', width: '220px', fontFamily: 'Outfit, sans-serif' };
const pillStyle  = { padding: '6px 14px', border: '1px solid #e5e7eb', backgroundColor: '#fff', borderRadius: '999px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#374151', transition: 'all 0.15s' };
const activePillStyle = { ...pillStyle, backgroundColor: '#111827', color: '#fff', border: '1px solid #111827' };
const primaryBtnStyle = { padding: '9px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.15s' };
const editBtnStyle   = { padding: '6px 12px', border: '1px solid #bfdbfe', backgroundColor: 'transparent', color: '#1d4ed8', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'background-color 0.15s' };
const deleteBtnStyle = { padding: '6px 12px', border: '1px solid #fecaca', backgroundColor: 'transparent', color: '#b91c1c', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'background-color 0.15s' };
const badgeStyle = (bg, text) => ({ backgroundColor: bg, color: text, padding: '3px 9px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' });
const pageBtnStyle = (active) => ({ padding: '6px 12px', border: `1px solid ${active ? '#111827' : '#e5e7eb'}`, backgroundColor: active ? '#111827' : '#fff', color: active ? '#fff' : '#374151', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', fontWeight: active ? '600' : '400', minWidth: '36px' });
const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: '#fff', borderRadius: '12px', padding: '28px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };

export default AdminProducts;
