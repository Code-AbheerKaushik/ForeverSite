import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const CATEGORIES     = ['Men', 'Women', 'Kids'];
const SUB_CATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear'];
const ALL_SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function AdminEditProduct() {
    const { id }    = useParams();
    const navigate  = useNavigate();
    const token     = localStorage.getItem('auth-token');

    const [form, setForm]     = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error,  setError]  = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch from admin-api products list and find the specific one by _id
        fetch(`${API_BASE_URL}/admin-api/products`, {
            headers: { authorization: token }
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const found = data.data.find(p => p._id === id);
                if (found) {
                    // Normalise image array to 3 slots
                    const imgs = [...(found.image || [])];
                    while (imgs.length < 3) imgs.push('');
                    setForm({ ...found, image: imgs });
                } else {
                    setError('Product not found.');
                }
            }
        })
        .catch(() => setError('Failed to load product.'))
        .finally(() => setLoading(false));
    }, [id, token]);

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
        setError(''); setSuccess('');
        setSaving(true);
        try {
            const payload = {
                name:        form.name,
                description: form.description,
                price:       Number(form.price),
                category:    form.category,
                subCategory: form.subCategory,
                sizes:       form.sizes,
                image:       form.image.filter(Boolean),
                stock:       Number(form.stock),
                bestseller:  form.bestseller,
            };
            const res  = await fetch(`${API_BASE_URL}/admin-api/products/${id}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json', authorization: token },
                body:    JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Product updated successfully!');
                setTimeout(() => navigate('/admin/products'), 1000);
            } else {
                setError(data.message || 'Failed to update product.');
            }
        } catch {
            setError('Server error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p style={{ color: '#6b7280' }}>Loading product…</p>;
    if (!form)   return <p style={{ color: '#dc2626' }}>{error || 'Product not found.'}</p>;

    return (
        <div style={{ maxWidth: '760px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => navigate('/admin/products')} style={backBtnStyle}>← Back</button>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>Edit Product</h1>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Update the details below and save</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={cardStyle}>

                    <FormGroup label="Product Name" required>
                        <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} />
                    </FormGroup>

                    <FormGroup label="Description">
                        <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
                    </FormGroup>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <FormGroup label="Price ($)" required>
                            <input style={inputStyle} type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} />
                        </FormGroup>
                        <FormGroup label="Stock (units)" required>
                            <input style={inputStyle} type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} />
                        </FormGroup>
                    </div>

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

                    <FormGroup label="Available Sizes">
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {ALL_SIZES.map(s => (
                                <button type="button" key={s} onClick={() => toggleSize(s)}
                                    style={(form.sizes || []).includes(s) ? activeSizeBtn : sizeBtn}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </FormGroup>

                    <FormGroup label="Image URLs (up to 3)">
                        {form.image.map((url, i) => (
                            <input key={i} style={{ ...inputStyle, marginBottom: i < 2 ? '8px' : '0' }}
                                value={url} onChange={e => handleImageChange(i, e.target.value)}
                                placeholder={`Image URL ${i + 1}`} />
                        ))}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            {form.image.filter(Boolean).map((url, i) => (
                                <img key={i} src={url} alt="" style={{ width: '56px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} onError={e => e.target.style.display = 'none'} />
                            ))}
                        </div>
                    </FormGroup>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" id="bestseller" checked={form.bestseller || false} onChange={e => set('bestseller', e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                        <label htmlFor="bestseller" style={{ fontSize: '14px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>Mark as Bestseller</label>
                    </div>

                    {error   && <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>}
                    {success && <p style={{ color: '#15803d', fontSize: '13px' }}>{success}</p>}

                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <button type="submit" disabled={saving} style={{ ...submitBtnStyle, opacity: saving ? 0.7 : 1 }}>
                            {saving ? 'Saving…' : 'Save Changes'}
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
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                {label}{required && <span style={{ color: '#dc2626' }}> *</span>}
            </label>
            {children}
        </div>
    );
}

const cardStyle      = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const inputStyle     = { padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', fontFamily: 'Outfit, sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box', color: '#111827' };
const sizeBtn        = { padding: '7px 14px', border: '1px solid #e5e7eb', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#374151' };
const activeSizeBtn  = { ...sizeBtn, backgroundColor: '#111827', color: '#fff', border: '1px solid #111827' };
const submitBtnStyle = { padding: '10px 24px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };
const cancelBtnStyle = { padding: '10px 20px', backgroundColor: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '7px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };
const backBtnStyle   = { background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', color: '#6b7280', fontFamily: 'Outfit, sans-serif' };

export default AdminEditProduct;
