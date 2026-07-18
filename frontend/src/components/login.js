import React from 'react'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react';
import { CartContext } from './context';
import { useContext } from 'react';
import Alert from './Alert';

function Login(props) {
    const { setCartNo, setUserEmail } = useContext(CartContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(null); // { message, type }

    const onChangeE = (e) => setEmail(e.target.value);
    const onChangeP = (e) => setPassword(e.target.value);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const showAlert = (message, type) => {
        setAlert(null); // reset first so re-triggering re-mounts with animation
        setTimeout(() => setAlert({ message, type }), 10);
    };

    const loginclick = async () => {
        if (!email.trim() || !password.trim()) {
            showAlert("Please enter both email and password.", "error");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.message === "Login successful" && data.token) {
                localStorage.setItem("auth-token", data.token);
                setUserEmail(email);
                showAlert("Logged in successfully!", "success");

                // Merge guest cart if present
                const guestCartStr = localStorage.getItem("guest-cart");
                let finalCartNo = data.cartNo;
                if (guestCartStr) {
                    try {
                        const guestCart = JSON.parse(guestCartStr);
                        if (guestCart && guestCart.length > 0) {
                            const mergeRes = await fetch("http://localhost:8080/products/mergecart", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "authorization": data.token
                                },
                                body: JSON.stringify({ guestCart })
                            });
                            const mergeData = await mergeRes.json();
                            if (mergeRes.ok && mergeData.success) {
                                finalCartNo = mergeData.cartNo;
                                localStorage.removeItem("guest-cart");
                            }
                        }
                    } catch (e) {
                        console.log("Error merging guest cart:", e);
                    }
                }

                setCartNo(finalCartNo);
                // Navigate after a short delay so user sees success toast
                setTimeout(() => navigate("/"), 1000);
            } else {
                showAlert(data.message || "Login failed. Please try again.", "error");
            }
        } catch (error) {
            showAlert("Something went wrong. Please check your connection.", "error");
            console.log("login error:", error);
        }
    };

    return (
        <>
            {/* Toast alert — fixed, no layout shift */}
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className='flex flex-col space-y-3 items-center justify-center'>
                <div className='flex justify-center mt-20 items-center'>
                    <div className='flex justify-center text-4xl font-normal font-serif text-gray-700 my-2'>Login</div>
                    <div className='bg-black px-1 w-8 ml-2 h-[1.5px]'></div>
                </div>
                <div className='shadow-inner border border-black w-[450px] py-2 px-3 '>
                    <input
                        onKeyDown={(e) => { if (e.key === "Enter") loginclick(); }}
                        value={email}
                        onChange={onChangeE}
                        type="text"
                        placeholder="Email"
                        className="flex-1 outline-none text-gray-700 text-lg font-[Outfit] placeholder:text-gray-400 bg-transparent"
                    />
                </div>
                <div className='shadow-inner border border-black w-[450px] py-2 px-3 '>
                    <input
                        onKeyDown={(e) => { if (e.key === "Enter") loginclick(); }}
                        value={password}
                        onChange={onChangeP}
                        type="password"
                        placeholder="Password"
                        className="flex-1 outline-none text-gray-700 text-lg font-[Outfit] placeholder:text-gray-400 bg-transparent"
                    />
                </div>
                <div className='w-[450px] flex justify-between'>
                    <p className='font-[Outfit] cursor-pointer'>Forgot your password?</p>
                    <p onClick={() => navigate("/signup")} className='font-[Outfit] cursor-pointer'>Create account</p>
                </div>
                <div>
                    <button onClick={loginclick} className="border border-black mt-4 px-8 py-2 text-base font-[Outfit] font-medium bg-black text-white">
                        Sign In
                    </button>
                </div>
            </div>
        </>
    )
}

export default Login
