import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, amount, paymentMethod } = location.state || {
        orderId: "N/A",
        amount: 0,
        paymentMethod: "COD"
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="pt-20 w-[1240px] flex flex-col items-center justify-center mx-auto my-10 font-[Outfit] text-center">
            {/* Green Success Badge */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-green-500 text-4xl font-bold">✓</span>
            </div>

            <div className="inline-flex gap-2 items-center mb-4">
                <p className="text-gray-500 text-3xl">
                    ORDER <span className="text-gray-700 font-medium">PLACED SUCCESSFULLY</span>
                </p>
                <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
            </div>

            <p className="text-gray-500 text-lg max-w-md mb-8">
                Thank you for your purchase! Your order is being processed and will be shipped soon.
            </p>

            {/* Order Details Card */}
            <div className="border border-gray-200 bg-slate-50 rounded-lg p-8 w-full max-w-lg text-left shadow-sm flex flex-col gap-4 mb-10">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Order ID:</span>
                    <strong className="text-gray-800 font-medium select-all">{orderId}</strong>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Amount Paid:</span>
                    <strong className="text-gray-800 font-medium">${amount}</strong>
                </div>

                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Payment Method:</span>
                    <strong className="text-gray-800 font-medium">{paymentMethod === 'COD' ? 'Cash On Delivery' : paymentMethod}</strong>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Delivery:</span>
                    <strong className="text-green-600 font-medium">3 - 5 Business Days</strong>
                </div>
            </div>

            {/* Actions */}
            <div>
                <button
                    onClick={() => navigate("/")}
                    className="bg-black text-white px-8 py-3 text-sm rounded active:bg-gray-800 transition-colors"
                >
                    CONTINUE SHOPPING
                </button>
            </div>
        </div>
    );
}

export default OrderSuccess;
