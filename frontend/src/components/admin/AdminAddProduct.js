import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES    = ['Men', 'Women', 'Kids'];
const SUB_CATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear'];
const ALL_SIZES     = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const emptyForm = {
    name: '', description: '', price: '', category: 'Men',
    subCategory: 'Topwear', sizes: [], image: ['', '', ''],
    stock: '', bestseller: false,
};

function AdminAddProduct() {
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const toggleSize = (s) => {
        setForm(f => ({
            ...f,
            sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
        }));
    };

    const handleImageChange = (i, val) => {
        const imgs = [...form.image];
        imgs[i] = val;
        setForm(f => ({ ...f, image: imgs }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const imageUrls = form.image.filter(Boolean);
        if (imageUrls.length === 0) { setError('Please add at least one image URL.'); return; }
        if (!form.name || !form.price || !form.stock) { setError('Name, price, and stock are required.'); return; }

        setSaving(true);
        try {
            const payload = {
                id: Date.now().toString(),
                name: form.name,
                description: form.description,
                price: Number(form.price),
                category: form.category,
                subCategory: form.subCategory,
                sizes: form.sizes,
                image: imageUrls,
                stock: Number(form.stock),
                bestseller: form.bestseller,
                date: new Date().toISOString(),
            };

            const res  = await fetch('http://localhost:8080/products/addProduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', authorization: token },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.status || data.success) {
                navigate('/admin/products');
            } else {
                setError(data.message || 'Failed to add product.');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ maxWidth: '760px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => navigate('/admin/products')} style={backBtnStyle}>← Back</button>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>Add New Product</h1>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Fill in the details to list a new product</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={cardStyle}>

                    {/* Name */}
                    <FormGroup label="Product Name" required>
                        <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Black Slim-Fit Hoodie" />
                    </FormGroup>

                    {/* Description */}
                    <FormGroup label="Description">
                        <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description…" />
                    </FormGroup>

                    {/* Price & Stock */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <FormGroup label="Price ($)" required>
                            <input style={inputStyle} type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" />
                        </FormGroup>
                        <FormGroup label="Stock (units)" required>
                            <input style={inputStyle} type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
                        </FormGroup>
                    </div>

                    {/* Category & SubCategory */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <FormGroup label="Category">
                            <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </FormGroup>
                        <FormGroup label="Sub-Category">
                            <select style={inputStyle} value={form.subCategory} onChange={e => set('subCategory', e.target.value)}>
                                {SUB_CATEGORIES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </FormGroup>
                    </div>

                    {/* Sizes */}
                    <FormGroup label="Available Sizes">
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {ALL_SIZES.map(s => (
                                <button
                                    type="button" key={s}
                                    onClick={() => toggleSize(s)}
                                    style={form.sizes.includes(s) ? activeSizeBtn : sizeBtn}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </FormGroup>

                    {/* Image URLs */}
                    <FormGroup label="Image URLs (up to 3)">
                        {form.image.map((url, i) => (
                            <input
                                key={i}
                                style={{ ...inputStyle, marginBottom: i < 2 ? '8px' : '0' }}
                                value={url}
                                onChange={e => handleImageChange(i, e.target.value)}
                                placeholder={`Image URL ${i + 1}`}
                            />
                        ))}
                        {/* Preview */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            {form.image.filter(Boolean).map((url, i) => (
                                <img key={i} src={url} alt="" style={{ width: '56px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} onError={e => e.target.style.display = 'none'} />
                            ))}
                        </div>
                    </FormGroup>

                    {/* Bestseller */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox" id="bestseller"
                            checked={form.bestseller}
                            onChange={e => set('bestseller', e.target.checked)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <label htmlFor="bestseller" style={{ fontSize: '14px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
                            Mark as Bestseller
                        </label>
                    </div>

                    {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{error}</p>}

                    {/* Submit */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button
                            type="submit" disabled={saving}
                            style={{ ...submitBtnStyle, opacity: saving ? 0.7 : 1 }}
                        >
                            {saving ? 'Adding…' : 'Add Product'}
                        </button>
                        <button type="button" onClick={() => navigate('/admin/products')} style={cancelBtnStyle}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function FormGroup({ label, children, required }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', letterSpacing: '0.01em' }}>
                {label}{required && <span style={{ color: '#dc2626' }}> *</span>}
            </label>
            {children}
        </div>
    );
}

// ── Styles ────────────────────────────────────────────────────────
const cardStyle       = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const inputStyle      = { padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', fontFamily: 'Outfit, sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box', color: '#111827' };
const sizeBtn         = { padding: '7px 14px', border: '1px solid #e5e7eb', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#374151', transition: 'all 0.15s' };
const activeSizeBtn   = { ...sizeBtn, backgroundColor: '#111827', color: '#fff', border: '1px solid #111827' };
const submitBtnStyle  = { padding: '10px 24px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.15s' };
const cancelBtnStyle  = { padding: '10px 20px', backgroundColor: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '7px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };
const backBtnStyle    = { background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', color: '#6b7280', fontFamily: 'Outfit, sans-serif' };

export default AdminAddProduct;
