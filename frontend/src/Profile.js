import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from './components/Alert';
import { API_BASE_URL } from './config';

const BASE = API_BASE_URL;

const STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
    'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
    'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'
];

const emptyAddr = { label: 'Home', fullName: '', phone: '', address: '', city: '', state: 'Madhya Pradesh', pincode: '' };

function Profile() {
    const navigate = useNavigate();
    const [alert, setAlert]           = useState(null);
    const [user,  setUser]            = useState(null);
    const [loading, setLoading]       = useState(true);

    // Profile edit state
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm]       = useState({ name: '', phone: '' });
    const [savingProfile, setSavingProfile]   = useState(false);

    // Address state
    const [addrModal, setAddrModal]   = useState(null); // null | 'add' | address object (for edit)
    const [addrForm,  setAddrForm]    = useState(emptyAddr);
    const [savingAddr, setSavingAddr] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // address object

    const token = localStorage.getItem('auth-token');

    const showAlert = (message, type) => {
        setAlert(null);
        setTimeout(() => setAlert({ message, type }), 10);
    };

    // ── Fetch profile ───────────────────────────────────────
    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetch(`${BASE}/user/profile`, { headers: { authorization: token } })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setUser(data.user);
                    setProfileForm({ name: data.user.name || '', phone: data.user.phone || '' });
                } else {
                    showAlert('Could not load profile.', 'error');
                }
            })
            .catch(() => showAlert('Connection error.', 'error'))
            .finally(() => setLoading(false));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [token, navigate]);

    // ── Save profile ─────────────────────────────────────────
    const saveProfile = async () => {
        if (!profileForm.name || profileForm.name.trim().length < 2) {
            showAlert('Name must be at least 2 characters.', 'error'); return;
        }
        if (!profileForm.phone || profileForm.phone.trim().length < 7) {
            showAlert('Please enter a valid phone number.', 'error'); return;
        }
        setSavingProfile(true);
        try {
            const res  = await fetch(`${BASE}/user/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', authorization: token },
                body: JSON.stringify(profileForm),
            });
            const data = await res.json();
            if (data.success) {
                setUser(prev => ({ ...prev, name: profileForm.name, phone: profileForm.phone }));
                setEditingProfile(false);
                showAlert('Profile updated!', 'success');
            } else {
                showAlert(data.message || 'Update failed.', 'error');
            }
        } catch { showAlert('Connection error.', 'error'); }
        finally   { setSavingProfile(false); }
    };

    // ── Open address modal ───────────────────────────────────
    const openAddModal  = () => { setAddrForm(emptyAddr); setAddrModal('add'); };
    const openEditModal = (addr) => {
        setAddrForm({
            label: addr.label, fullName: addr.fullName, phone: addr.phone,
            address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode
        });
        setAddrModal(addr); // store full addr object so we have _id
    };

    // ── Save address (add or edit) ───────────────────────────
    const saveAddress = async () => {
        const f = addrForm;
        if (!f.fullName || !f.phone || !f.address || !f.city || !f.state || !f.pincode) {
            showAlert('Please fill in all address fields.', 'error'); return;
        }
        setSavingAddr(true);
        try {
            const isEdit = addrModal !== 'add';
            const url    = isEdit ? `${BASE}/user/address/${addrModal._id}` : `${BASE}/user/address`;
            const method = isEdit ? 'PUT' : 'POST';
            const res    = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', authorization: token },
                body: JSON.stringify(f),
            });
            const data = await res.json();
            if (data.success) {
                setUser(prev => ({ ...prev, addresses: data.addresses }));
                setAddrModal(null);
                showAlert(isEdit ? 'Address updated!' : 'Address added!', 'success');
            } else {
                showAlert(data.message || 'Failed to save address.', 'error');
            }
        } catch { showAlert('Connection error.', 'error'); }
        finally   { setSavingAddr(false); }
    };

    // ── Set default ──────────────────────────────────────────
    const setDefault = async (addrId) => {
        try {
            const res  = await fetch(`${BASE}/user/address/default/${addrId}`, {
                method: 'PUT', headers: { authorization: token }
            });
            const data = await res.json();
            if (data.success) {
                setUser(prev => ({ ...prev, addresses: data.addresses }));
                showAlert('Default address updated!', 'success');
            }
        } catch { showAlert('Connection error.', 'error'); }
    };

    // ── Delete address ───────────────────────────────────────
    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res  = await fetch(`${BASE}/user/address/${deleteTarget._id}`, {
                method: 'DELETE', headers: { authorization: token }
            });
            const data = await res.json();
            if (data.success) {
                setUser(prev => ({ ...prev, addresses: data.addresses }));
                setDeleteTarget(null);
                showAlert('Address deleted.', 'success');
            }
        } catch { showAlert('Connection error.', 'error'); }
    };

    if (loading) {
        return (
            <div className="pt-20 w-[1240px] flex justify-center items-center mx-auto my-10 font-[Outfit] text-gray-500">
                <p className="text-2xl tracking-wide">Loading profile…</p>
            </div>
        );
    }

    return (
        <div className="pt-14 w-[1240px] flex flex-col mx-auto my-10 font-[Outfit]">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

            {/* ── Section Heading ── */}
            <SectionHeading title="MY" highlight="PROFILE" />

            {/* ── Profile Card ── */}
            <div className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm mb-10">
                {!editingProfile ? (
                    /* View Mode */
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-5">
                            {/* Avatar letter */}
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-2xl font-bold select-none">
                                    {(user?.name || user?.email || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-gray-800">{user?.name || <span className="text-gray-400 italic">No name set</span>}</p>
                                    <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 pl-1">
                                <InfoRow label="Email"  value={user?.email} />
                                <InfoRow label="Phone"  value={user?.phone  || <span className="text-gray-400 italic">Not set</span>} />
                            </div>
                        </div>
                        <button
                            onClick={() => setEditingProfile(true)}
                            className="border border-gray-300 text-gray-600 text-sm px-5 py-2.5 rounded hover:border-black hover:text-black transition-colors tracking-wide"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    /* Edit Mode */
                    <div className="flex flex-col gap-5 max-w-md">
                        <p className="text-base font-semibold text-gray-700 mb-1">Edit Profile</p>
                        <FormField label="Full Name">
                            <input
                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
                                value={profileForm.name}
                                onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Your full name"
                            />
                        </FormField>
                        <FormField label="Email (read-only)">
                            <input
                                className="w-full border border-gray-100 rounded px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                                value={user?.email} readOnly
                            />
                        </FormField>
                        <FormField label="Phone Number">
                            <input
                                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors"
                                value={profileForm.phone}
                                onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </FormField>
                        <div className="flex gap-3 mt-1">
                            <button
                                onClick={saveProfile}
                                disabled={savingProfile}
                                className="bg-black text-white text-sm px-6 py-2.5 rounded hover:bg-gray-800 transition-colors disabled:opacity-60 tracking-wide"
                            >
                                {savingProfile ? 'Saving…' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => setEditingProfile(false)}
                                className="border border-gray-300 text-gray-600 text-sm px-5 py-2.5 rounded hover:border-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Addresses Section ── */}
            <div className="flex justify-between items-center mb-6">
                <SectionHeading title="SAVED" highlight="ADDRESSES" noMargin />
                <button
                    onClick={openAddModal}
                    className="bg-black text-white text-sm px-5 py-2.5 rounded hover:bg-gray-800 transition-colors tracking-wide"
                >
                    + Add New Address
                </button>
            </div>

            {user?.addresses?.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-400 text-base mb-4">No saved addresses yet.</p>
                    <button
                        onClick={openAddModal}
                        className="bg-black text-white text-sm px-6 py-2.5 rounded hover:bg-gray-800 transition-colors tracking-wide"
                    >
                        Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {user.addresses.map(addr => (
                        <div
                            key={addr._id}
                            className={`relative border rounded-lg p-6 bg-white shadow-sm flex flex-col gap-3 transition-all ${
                                addr.isDefault
                                    ? 'border-l-4 border-l-green-500 border-t border-r border-b border-gray-200'
                                    : 'border border-gray-200'
                            }`}
                        >
                            {/* Label row */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{addr.label}</span>
                                {addr.isDefault && (
                                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                                        Default
                                    </span>
                                )}
                            </div>

                            {/* Address details */}
                            <div className="text-sm text-gray-600 leading-relaxed flex flex-col gap-0.5">
                                <p className="font-medium text-gray-800">{addr.fullName}</p>
                                <p>{addr.phone}</p>
                                <p>{addr.address}</p>
                                <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-1 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => openEditModal(addr)}
                                    className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded hover:border-gray-400 hover:text-black transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(addr)}
                                    className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded hover:border-red-300 hover:text-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => setDefault(addr._id)}
                                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded hover:border-green-400 hover:text-green-700 transition-colors ml-auto"
                                    >
                                        Set Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Address Modal (Add / Edit) ── */}
            {addrModal !== null && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">
                            {addrModal === 'add' ? 'Add New Address' : 'Edit Address'}
                        </h3>
                        <div className="flex flex-col gap-4">
                            <FormField label="Label (e.g. Home, Work, Hostel)">
                                <input className={inputCls} value={addrForm.label} onChange={e => setAddrForm(f => ({ ...f, label: e.target.value }))} placeholder="Home" />
                            </FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Full Name">
                                    <input className={inputCls} value={addrForm.fullName} onChange={e => setAddrForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Abheer Kaushik" />
                                </FormField>
                                <FormField label="Phone">
                                    <input className={inputCls} value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                                </FormField>
                            </div>
                            <FormField label="Street Address">
                                <input className={inputCls} value={addrForm.address} onChange={e => setAddrForm(f => ({ ...f, address: e.target.value }))} placeholder="123 ABC Colony" />
                            </FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="City">
                                    <input className={inputCls} value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} placeholder="Bhopal" />
                                </FormField>
                                <FormField label="Pincode">
                                    <input className={inputCls} value={addrForm.pincode} onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value }))} placeholder="462001" maxLength={6} />
                                </FormField>
                            </div>
                            <FormField label="State">
                                <select className={inputCls} value={addrForm.state} onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))}>
                                    {STATES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </FormField>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={saveAddress}
                                disabled={savingAddr}
                                className="bg-black text-white text-sm px-6 py-2.5 rounded hover:bg-gray-800 transition-colors disabled:opacity-60 tracking-wide"
                            >
                                {savingAddr ? 'Saving…' : addrModal === 'add' ? 'Add Address' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => setAddrModal(null)}
                                className="border border-gray-300 text-gray-600 text-sm px-5 py-2.5 rounded hover:border-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Modal ── */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Address?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete the <strong>"{deleteTarget.label}"</strong> address? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-white text-sm px-5 py-2.5 rounded hover:bg-red-700 transition-colors tracking-wide"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="border border-gray-300 text-gray-600 text-sm px-5 py-2.5 rounded hover:border-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Small helpers ──────────────────────────────────────────────────────────
function SectionHeading({ title, highlight, noMargin }) {
    return (
        <div className={`inline-flex gap-3 items-center ${noMargin ? '' : 'mb-6'}`}>
            <p className="text-gray-500 text-3xl tracking-wide">
                {title} <span className="text-gray-700 font-medium">{highlight}</span>
            </p>
            <p className="w-10 sm:w-16 h-[2px] bg-gray-700"></p>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex gap-3 items-start text-sm">
            <span className="text-gray-400 w-14 shrink-0">{label}</span>
            <span className="text-gray-700 font-medium">{value}</span>
        </div>
    );
}

function FormField({ label, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}

const inputCls = "w-full border border-gray-200 rounded px-3 py-2.5 text-sm outline-none focus:border-gray-400 transition-colors font-[Outfit]";

export default Profile;
