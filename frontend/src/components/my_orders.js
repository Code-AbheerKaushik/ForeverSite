import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import ImageWithSpinner from './ImageWithSpinner';
import { API_BASE_URL } from '../config';

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type) => {
        setAlert(null);
        setTimeout(() => setAlert({ message, type }), 10);
    };

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/orders/myorders`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": token
                    }
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    setOrders(data.data || []);
                } else {
                    showAlert(data.message || "Failed to fetch order history.", "error");
                }
            } catch (error) {
                console.log("Error fetching orders:", error);
                showAlert("Something went wrong. Please check your connection.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'placed':
                return 'bg-blue-500';
            case 'packed':
                return 'bg-yellow-500';
            case 'shipped':
                return 'bg-purple-500';
            case 'delivered':
                return 'bg-green-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="pt-20 w-[1240px] flex justify-center items-center mx-auto my-10 font-[Outfit] text-gray-500">
                <p className="text-2xl tracking-wide">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="pt-14 w-[1240px] flex flex-col mx-auto my-10 font-[Outfit]">
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* Page Heading */}
            <div className="inline-flex gap-3 items-center mb-10">
                <p className="text-gray-500 text-3xl tracking-wide">
                    MY <span className="text-gray-700 font-medium">ORDERS</span>
                </p>
                <p className="w-10 sm:w-16 h-[2px] bg-gray-700"></p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-28 flex flex-col items-center justify-center gap-6">
                    <p className="text-gray-400 text-xl">You have not placed any orders yet.</p>
                    <button
                        onClick={() => navigate("/collection")}
                        className="bg-black text-white px-10 py-4 text-base rounded active:bg-gray-800 transition-colors tracking-wider"
                    >
                        START SHOPPING
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-gray-200 rounded-lg p-8 bg-white shadow-sm flex flex-col gap-6"
                        >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row justify-between border-b pb-5 gap-3 text-base text-gray-500">
                                <div className="leading-relaxed">
                                    <span className="font-semibold text-gray-700 text-base">Order ID: </span>
                                    <span className="text-gray-500">{order._id}</span>
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <span className="font-semibold text-gray-700">Date: </span>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Payment: </span>
                                        {order.paymentMethod} ({order.paymentStatus})
                                    </div>
                                </div>
                            </div>

                            {/* Ordered Products List */}
                            <div className="flex flex-col gap-6">
                                {order.products.map((item, idx) => {
                                    if (!item.product) return null;
                                    return (
                                        <div
                                            key={`${item.product._id}-${idx}`}
                                            className="flex items-center justify-between border-b last:border-0 pb-6 last:pb-0 gap-6"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-24 h-28 relative overflow-hidden border border-gray-100 rounded flex-shrink-0">
                                                    <ImageWithSpinner
                                                        src={item.product.image && item.product.image[0]}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <p className="font-medium text-gray-800 text-lg">{item.product.name}</p>
                                                    <div className="flex items-center gap-5 text-base text-gray-500">
                                                        <p className="font-medium">${item.product.price}</p>
                                                        <p>Qty: {item.quantity}</p>
                                                        <p>Size: <span className="font-medium text-gray-700">{item.size}</span></p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2.5">
                                                <span className={`w-3 h-3 rounded-full ${getStatusColor(order.orderStatus)}`} />
                                                <span className="text-base capitalize font-medium text-gray-700 tracking-wide">
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Footer */}
                            <div className="flex justify-between items-center border-t pt-5 mt-1">
                                <div>
                                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-800">${order.amount}</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/product/${order.products[0]?.product?._id}`)}
                                    className="border border-gray-300 text-gray-600 text-sm px-6 py-3 rounded hover:border-black hover:text-black transition-colors tracking-wide"
                                >
                                    Buy Again
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
