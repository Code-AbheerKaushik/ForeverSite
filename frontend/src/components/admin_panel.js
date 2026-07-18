import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CartContext } from './context';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminAddProduct from './admin/AdminAddProduct';
import AdminEditProduct from './admin/AdminEditProduct';
import AdminOrders from './admin/AdminOrders';
import AdminOrderDetail from './admin/AdminOrderDetail';

const ADMIN_EMAIL = "abheerkaushik2@gmail.com";

function AdminPanel() {
    const { userEmail } = useContext(CartContext);

    // Still loading auth state
    if (userEmail === null) return null;

    // Not the admin — redirect to home
    if (userEmail !== ADMIN_EMAIL) return <Navigate to="/" replace />;

    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminAddProduct />} />
                <Route path="products/edit/:id" element={<AdminEditProduct />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
            </Route>
        </Routes>
    );
}

export default AdminPanel;
