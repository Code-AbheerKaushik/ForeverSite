import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import { CartContext } from './context';
import Alert from './Alert';

function Signup() {
    const { setCartNo, setUserEmail } = useContext(CartContext);
    const onChangeE = (e) => {
        setEmail(e.target.value)
    }
    const onChangeP = (e) => {
        setPassword(e.target.value)
    }
    const onChangeR = (e) => {
        setRPassword(e.target.value);
    }
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Rpassword, setRPassword] = useState("");
    const [alert, setAlert] = useState(null); // { message, type }

    const showAlert = (message, type) => {
        setAlert(null); // reset first so re-triggering re-mounts with animation
        setTimeout(() => setAlert({ message, type }), 10);
    };

    const signupclick = async () => {
        if (!email.trim() || !password.trim() || !Rpassword.trim()) {
            showAlert("Please fill in all fields.", "error");
            return;
        }

        if (password !== Rpassword) {
            showAlert("Passwords do not match.", "error");
            return;
        }

        try {
            const url = "http://localhost:8080/auth/signup";

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();
            console.log("response:", data);
            if (res.ok && data.status && data.token) {
                localStorage.setItem("auth-token", data.token);
                setUserEmail(email);
                showAlert("Account created successfully!", "success");

                // Merge guest cart if present
                const guestCartStr = localStorage.getItem("guest-cart");
                let finalCartNo = 0;
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
                setTimeout(() => navigate("/"), 1000);
            } else {
                showAlert(data.message || "Registration failed. Please try again.", "error");
            }
        } catch (error) {
            console.log("signup error:", error);
            showAlert("Something went wrong. Please check your connection.", "error");
        }
    };
    return (
        <>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className='flex flex-col space-y-3 items-center justify-center'>
                <div className='flex justify-center mt-20 items-center'>
                    <div className='flex justify-center text-4xl font-normal font-serif text-gray-700 my-2'>Signup</div>
                    <div className='bg-black px-1 w-8 ml-2 h-[1.5px]'></div>
                </div>
                <div className='shadow-inner border border-black w-[450px] py-2 px-3 '>
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                signupclick();
                            }
                        }}
                        value={email}
                        onChange={onChangeE}
                        type="text"
                        placeholder="Email"
                        className="flex-1 outline-none text-gray-700 text-lg font-[Outfit] placeholder:text-gray-400 bg-transparent"
                    />
                </div>
                <div className='shadow-inner border border-black w-[450px] py-2 px-3 '>
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                signupclick();
                            }
                        }}
                        value={password}
                        onChange={onChangeP}
                        type="password"
                        placeholder="Password"
                        className="flex-1 outline-none text-gray-700 text-lg font-[Outfit] placeholder:text-gray-400 bg-transparent"
                    />
                </div>
                <div className='shadow-inner border border-black w-[450px] py-2 px-3 '>
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                signupclick();
                            }
                        }}
                        value={Rpassword}
                        onChange={onChangeR}
                        type="password"
                        placeholder="Re-enter Password"
                        className="flex-1 outline-none text-gray-700 text-lg font-[Outfit] placeholder:text-gray-400 bg-transparent"
                    />
                </div>
                <div className='w-[450px] flex justify-between'>
                    <p className='font-[Outfit] cursor-pointer'>Forgot your password?</p>
                    <p onClick={() => navigate("/login")} className='font-[Outfit] cursor-pointer'>Login</p>
                </div>
                <div>
                    <button onClick={signupclick} className="border border-black mt-4 px-8 py-2 text-base font-[Outfit] font-medium bg-black text-white">
                        Sign Up
                    </button>
                </div>
            </div>
        </>
    )
}

export default Signup
