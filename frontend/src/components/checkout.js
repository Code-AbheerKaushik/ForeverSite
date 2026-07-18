import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './context';
import Alert from './Alert';
import { API_BASE_URL } from '../config';

function Checkout() {
    const navigate = useNavigate();
    const { cartarray, setcartarray, cartTotal, setCartNo, setCartTotal } = useContext(CartContext);
    
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [alert, setAlert] = useState(null); // { message, type }
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Redirect guest users to login; prefill default address if available
    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (!token) {
            navigate("/login");
            return;
        }
        window.scrollTo(0, 0);

        // Try to prefill from saved default address
        fetch(`${API_BASE_URL}/user/profile`, {
            headers: { authorization: token }
        })
        .then(r => r.json())
        .then(data => {
            if (data.success && data.user?.addresses?.length > 0) {
                const defaultAddr = data.user.addresses.find(a => a.isDefault) || data.user.addresses[0];
                setShippingInfo({
                    fullName: defaultAddr.fullName || "",
                    phone:    defaultAddr.phone    || "",
                    address:  defaultAddr.address  || "",
                    city:     defaultAddr.city     || "",
                    state:    defaultAddr.state    || "",
                    pincode:  defaultAddr.pincode  || "",
                });
            }
        })
        .catch(() => {}); // silently ignore — user can fill manually
    }, [navigate]);

    const showAlert = (message, type) => {
        setAlert(null);
        setTimeout(() => setAlert({ message, type }), 10);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getValidatedOrderPayload = () => {
        const { fullName, phone, address, city, state, pincode } = shippingInfo;

        // Validation
        if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
            showAlert("Please fill in all delivery details.", "error");
            return null;
        }

        // Phone number length validation (at least 10 digits)
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length < 10) {
            showAlert("Please enter a valid phone number (at least 10 digits).", "error");
            return null;
        }

        // Pincode validation (usually 5 or 6 digits)
        const cleanPincode = pincode.replace(/\D/g, "");
        if (cleanPincode.length < 5 || cleanPincode.length > 6) {
            showAlert("Please enter a valid pincode (5 or 6 digits).", "error");
            return null;
        }

        if (cartarray.length === 0) {
            showAlert("Your cart is empty.", "error");
            return null;
        }

        return {
            products: cartarray,
            shippingAddress: shippingInfo,
            paymentMethod,
        };
    };

    const handlePlaceOrder = async () => {
        const orderPayload = getValidatedOrderPayload();
        if (!orderPayload) return;

        if (paymentMethod === 'UPI_DEMO') {
            const pendingPayment = {
                ...orderPayload,
                amount: cartTotal > 0 ? cartTotal + 10 : 0,
            };
            sessionStorage.setItem('foreverbuy:pending-upi-payment', JSON.stringify(pendingPayment));
            navigate('/payment/demo', { state: { pendingPayment } });
            return;
        }

        setIsPlacingOrder(true);
        try {
            const url = `${API_BASE_URL}/orders/create`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("auth-token")
                },
                body: JSON.stringify({
                    products: cartarray,
                    shippingAddress: shippingInfo,
                    paymentMethod: paymentMethod
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                // Clear cart locally
                setcartarray([]);
                setCartNo(0);
                setCartTotal(0);

                // Redirect to success page
                navigate("/order-success", { 
                    state: { 
                        orderId: data.orderId,
                        amount: data.amount || (cartTotal > 0 ? cartTotal + 10 : 0),
                        paymentMethod: paymentMethod
                    } 
                });
            } else {
                showAlert(data.message || "Failed to place order. Please try again.", "error");
            }
        } catch (error) {
            console.log("Error placing order:", error);
            showAlert("Something went wrong. Please check your connection.", "error");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="pt-14 w-full max-w-[1240px] flex flex-col mx-auto my-10 px-4 font-[Outfit]">
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="flex flex-col lg:flex-row justify-between gap-12 pt-5">
                {/* Left Side: Delivery Information Form */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="inline-flex gap-2 items-center mb-3">
                        <p className="text-gray-500 text-xl sm:text-2xl">
                            DELIVERY <span className="text-gray-700 font-medium">INFORMATION</span>
                        </p>
                        <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
                    </div>

                    <input
                        required
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Full name"
                        className="border border-gray-300 rounded py-2 px-4 w-full outline-none focus:border-black transition-colors"
                    />

                    <input
                        required
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Street Address"
                        className="border border-gray-300 rounded py-2 px-4 w-full outline-none focus:border-black transition-colors"
                    />

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            required
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="City"
                            className="border border-gray-300 rounded py-2 px-4 w-full outline-none focus:border-black transition-colors"
                        />
                        <input
                            required
                            name="state"
                            value={shippingInfo.state}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="State"
                            className="border border-gray-300 rounded py-2 px-4 w-full outline-none focus:border-black transition-colors"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            required
                            name="pincode"
                            value={shippingInfo.pincode}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Pincode"
                            className="border border-gray-300 rounded py-2 px-4 w-full outline-none focus:border-black transition-colors"
                        />
                        <input
                            required
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Phone number"
                            className="border border-gray-300 rounded py-2 px-4 w-full outline-none focus:border-black transition-colors"
                        />
                    </div>
                </div>

                {/* Right Side: Order Summary & Payment Options */}
                <div className="w-full sm:w-[450px] flex flex-col gap-6">
                    {/* Cart Totals display */}
                    <div>
                        <div className="inline-flex gap-2 items-center mb-3">
                            <p className="text-gray-500 text-2xl">
                                CART <span className="text-gray-700 font-medium">TOTALS</span>
                            </p>
                            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
                        </div>

                        <div className="flex flex-col gap-2 mt-2 text-sm">
                            <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p>${cartTotal}</p>
                            </div>

                            <hr />

                            <div className="flex justify-between">
                                <p>Shipping Fee</p>
                                <p>${cartTotal > 0 ? "10.00" : "0.00"}</p>
                            </div>

                            <hr />

                            <div className="flex justify-between">
                                <b>Total</b>
                                <b>${cartTotal > 0 ? cartTotal + 10 : 0}</b>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="mt-4">
                        <div className="inline-flex gap-2 items-center mb-3">
                            <p className="text-gray-500 text-lg">
                                PAYMENT <span className="text-gray-700 font-medium">METHOD</span>
                            </p>
                            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                            <PaymentOption
                                active={paymentMethod === 'COD'}
                                onSelect={() => setPaymentMethod('COD')}
                                title="Cash on Delivery"
                                description="Pay when your order arrives"
                                icon="₹"
                            />
                            <PaymentOption
                                active={paymentMethod === 'UPI_DEMO'}
                                onSelect={() => setPaymentMethod('UPI_DEMO')}
                                title="UPI Demo"
                                description="Secure demo payment flow"
                                icon="UPI"
                                badge="Demo"
                            />
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <div className="w-full text-end mt-4">
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                            className="w-full bg-black text-white text-sm px-8 py-3.5 rounded active:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-16"
                        >
                            {isPlacingOrder ? 'PLACING ORDER…' : paymentMethod === 'UPI_DEMO' ? 'CONTINUE TO UPI' : 'PLACE ORDER'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentOption({ active, onSelect, title, description, icon, badge }) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={active}
            onClick={onSelect}
            className={`relative flex min-h-[112px] w-full items-start gap-3 rounded-lg border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                active ? 'border-black bg-gray-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
        >
            <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className={`flex h-10 min-w-10 items-center justify-center rounded-md px-2 text-xs font-bold ${active ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                {icon}
            </span>
            <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    {title}
                    {badge && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">{badge}</span>}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-gray-500">{description}</span>
            </span>
        </button>
    );
}

export default Checkout;
