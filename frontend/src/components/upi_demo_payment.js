import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from './context';
import { API_BASE_URL } from '../config';

const PENDING_PAYMENT_KEY = 'foreverbuy:pending-upi-payment';
const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

function readPendingPayment(locationState) {
    if (locationState?.pendingPayment) return locationState.pendingPayment;
    try {
        return JSON.parse(sessionStorage.getItem(PENDING_PAYMENT_KEY));
    } catch {
        return null;
    }
}

function UpiDemoPayment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setcartarray, setCartNo, setCartTotal } = useContext(CartContext);
    const [pendingPayment] = useState(() => readPendingPayment(location.state));
    const [status, setStatus] = useState('ready');
    const [error, setError] = useState('');
    const mounted = useRef(true);

    const amount = Number(pendingPayment?.amount || 0);
    const upiUri = useMemo(() => `upi://pay?pa=payments@foreverbuy.demo&pn=ForeverBuy&am=${amount.toFixed(2)}&cu=INR`, [amount]);

    useEffect(() => {
        window.scrollTo(0, 0);
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        if (!pendingPayment?.products?.length || !pendingPayment?.shippingAddress) {
            navigate('/checkout', { replace: true });
        }
    }, [navigate, pendingPayment]);

    const createPaidOrder = async () => {
        const response = await fetch(`${API_BASE_URL}/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('auth-token'),
            },
            body: JSON.stringify({
                products: pendingPayment.products,
                shippingAddress: pendingPayment.shippingAddress,
                paymentMethod: 'UPI_DEMO',
            }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Could not create your order.');
        return data;
    };

    const simulatePayment = async (shouldFail = false) => {
        setError('');
        setStatus('processing');
        await wait(1200);
        if (!mounted.current) return;

        setStatus('verifying');
        await wait(1200);
        if (!mounted.current) return;

        if (shouldFail) {
            setStatus('failed');
            setError('The demo payment was cancelled. No order has been created.');
            return;
        }

        try {
            const data = await createPaidOrder();
            if (!mounted.current) return;
            setStatus('success');
            sessionStorage.removeItem(PENDING_PAYMENT_KEY);
            setcartarray([]);
            setCartNo(0);
            setCartTotal(0);
            await wait(700);
            navigate('/order-success', {
                replace: true,
                state: { orderId: data.orderId, amount: data.amount || amount, paymentMethod: 'UPI_DEMO', paymentStatus: 'paid' },
            });
        } catch (paymentError) {
            if (!mounted.current) return;
            setStatus('failed');
            setError(paymentError.message || 'Payment verification could not be completed. Please try again.');
        }
    };

    if (!pendingPayment) return null;

    const isWorking = status === 'processing' || status === 'verifying';
    const statusText = status === 'processing' ? 'Processing Payment…' : status === 'verifying' ? 'Verifying Payment…' : 'I’ve Completed Payment';

    return (
        <main className="min-h-screen bg-gray-50 px-4 pb-12 pt-10 font-[Outfit] sm:pt-16">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
                    <div>
                        <p className="text-lg font-bold tracking-[0.12em] text-gray-900">FOREVERBUY</p>
                        <p className="mt-0.5 text-xs text-gray-500">Secure checkout</p>
                    </div>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Demo Payment System</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                        <div className="flex items-start gap-4 border-b border-gray-100 pb-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-xl text-green-700">⌁</div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">UPI Demo</p>
                                <h1 className="mt-1 text-2xl font-semibold text-gray-900">Complete your payment</h1>
                                <p className="mt-1 text-sm text-gray-500">Scan the QR code with any supported UPI app. This is a simulated payment.</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center py-8 text-center">
                            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                                <QRCodeSVG value={upiUri} size={220} level="M" includeMargin aria-label="Demo UPI payment QR code" className="h-auto w-[min(58vw,220px)]" />
                            </div>
                            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Paying ForeverBuy</p>
                            <p className="mt-1 text-3xl font-bold text-gray-900">${amount.toFixed(2)}</p>
                            <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                                UPI ID <span className="ml-2 font-semibold text-gray-900">payments@foreverbuy.demo</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-5">
                            <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Supported demo apps</p>
                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => <span key={app} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-center text-xs font-semibold text-gray-600">{app}</span>)}
                            </div>
                        </div>

                        {status === 'failed' && <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button onClick={() => simulatePayment(false)} disabled={isWorking || status === 'success'} className="min-h-12 flex-1 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60">
                                {isWorking && <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                                {statusText}
                            </button>
                            {status === 'failed' ? (
                                <button onClick={() => navigate('/checkout')} className="min-h-12 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-500">Return to checkout</button>
                            ) : (
                                <button onClick={() => simulatePayment(true)} disabled={isWorking} className="min-h-12 rounded-lg border border-gray-200 px-5 py-3 text-xs font-medium text-gray-500 transition-colors hover:border-gray-400 disabled:opacity-50">Simulate failure</button>
                            )}
                        </div>
                    </section>

                    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Order summary</p>
                        <div className="mt-4 space-y-3 border-b border-gray-100 pb-4">
                            {pendingPayment.products.map(item => <div key={`${item.product._id}-${item.size}`} className="flex items-start justify-between gap-3 text-sm"><span className="min-w-0 text-gray-600"><span className="block truncate font-medium text-gray-800">{item.product.name}</span><span className="text-xs">Qty {item.quantity} · {item.size}</span></span><span className="shrink-0 font-medium text-gray-800">${(item.product.price * item.quantity).toFixed(2)}</span></div>)}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm"><span className="text-gray-500">Delivery</span><span className="font-medium text-gray-800">$10.00</span></div>
                        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-4"><span className="font-semibold text-gray-900">Total</span><span className="text-xl font-bold text-gray-900">${amount.toFixed(2)}</span></div>
                        <p className="mt-5 rounded-lg bg-green-50 p-3 text-xs leading-relaxed text-green-800">Your payment is simulated for demonstration only. No real transaction will be made.</p>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default UpiDemoPayment;
