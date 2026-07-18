import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { assets } from '../assets/frontend_assets/assets';
import { CartContext } from './context';
import Alert from './Alert';
import ImageWithSpinner from './ImageWithSpinner';
import { API_BASE_URL } from '../config';

function Product(props) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [displayImg, setdisplayImg] = useState();
    const [size, setSize] = useState("");
    const [alert, setAlert] = useState(null);
    const { setCartNo, setcartarray } = useContext(CartContext);

    const showAlert = (message, type = 'error') => {
        setAlert(null);
        setTimeout(() => setAlert({ message, type }), 10);
    };

    const getItem = async () => {
        const url = `${API_BASE_URL}/products/getItem/${id}`;
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();
            setItem(data.data);
            setdisplayImg(data.data.image[0]);
        } catch (error) {
            console.log("error in getting item: ", error);
        }
    };
    
    const addcart = async () => {
        if (size === "") {
            showAlert("Please select a size first.", "error");
            return;
        }
        if (!item) return;

        if (!localStorage.getItem("auth-token")) {
            let guestCart = [];
            try {
                guestCart = JSON.parse(localStorage.getItem("guest-cart")) || [];
            } catch (e) {
                guestCart = [];
            }
            
            const existingIndex = guestCart.findIndex(
                cartItem => cartItem.product._id === item._id && cartItem.size === size
            );
            if (existingIndex !== -1) {
                guestCart[existingIndex].quantity++;
            } else {
                guestCart.push({
                    product: item,
                    quantity: 1,
                    size: size
                });
            }
            localStorage.setItem("guest-cart", JSON.stringify(guestCart));
            setcartarray(guestCart);
            setCartNo(guestCart.length);
            showAlert("Added to cart!", "success");
            return;
        }
        
        const url = `${API_BASE_URL}/products/addtocart`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("auth-token")
                },
                body: JSON.stringify({
                    item, size
                })
            });
            const data = await res.json();
            if (res.ok) {
                setCartNo(data.cartitem);
                showAlert("Added to cart!", "success");
            } else {
                showAlert(data.message || "Session expired. Please log in again.", "error");
            }
        } catch (error) {
            console.log("error in adding item to cart: ", error);
            showAlert("Failed to add item to cart. Please try again.", "error");
        }
    };

    useEffect(() => {
        getItem();
    }, []);
    const rev = [];
    const imgclick = (i) => {
        setdisplayImg(i)
    }
    const reviews = () => {
        for (let i = 1; i <= 4; i++) {
            rev.push(
                <img key={i} src={assets.star_icon} className='w-[12px] h-[11px] mr-[1px]' alt='' />
            )
        }
        for (let i = 5; i <= 5; i++) {
            rev.push(
                <img key={i} src={assets.star_dull_icon} className='w-[12px] h-[11px] mr-[1px]' alt='' />
            )
        }
        rev.push(<p key={6} className=" h-[25px]">(122)</p>)
        return (<div className='flex space-x-2 items-center w-[20px]'>
            {rev}
        </div>)
    }
    if (!item) return null
    return (
        <div className='w-[1240px] mx-auto flex my-10 relative'>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className='flex flex-col  mx-4'>
                {
                    item.image.map((i, index) => {
                        return (
                            <div key={index} onClick={() => imgclick(i)} className='w-[113.50px] overflow-hidden mb-[12px] h-[133px] cursor-pointer relative'>
                                <ImageWithSpinner src={i} alt='' className='w-full h-full object-cover' />
                            </div>
                        )
                    })
                }
            </div>
            <div className='w-[481.3px] h-[567.26px] relative'>
                <ImageWithSpinner className='w-full h-full object-cover' src={displayImg} alt='' />
            </div>
            <div className='flex flex-col mx-10'>
                <div className='font-[Outfit] text-2xl mt-2 '>
                    {item.name}
                </div>
                {reviews()}

                <div className='my-5 text-3xl font-medium'>
                    {`$${item.price}`}
                </div>
                <div className='text-lg text-gray-500 w-4/5'>
                    {item.description}
                </div>
                <p className='mt-5 h-[24px]'>
                    Select Size
                </p>
                <div className='flex mt-5 space-x-4'>
                    {["S", "M", "L", "XL", "XXL"].map(s => {
                        const available = item.sizes && item.sizes.includes(s);
                        const selected = size === s;
                        return (
                            <button
                                key={s}
                                onClick={() => available && setSize(s)}
                                className={`
                                    relative px-4 py-2 border overflow-hidden select-none transition-colors
                                    ${available
                                        ? selected
                                            ? "border-black bg-black text-white"
                                            : "bg-gray-100 hover:border-gray-400"
                                        : "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200"
                                    }
                                `}
                            >
                                {s}
                                {!available && (
                                    /* Diagonal cross line for unavailable sizes */
                                    <span
                                        className="pointer-events-none absolute inset-0"
                                        style={{
                                            background: "linear-gradient(to top right, transparent calc(50% - 0.6px), #d1d5db calc(50% - 0.6px), #d1d5db calc(50% + 0.6px), transparent calc(50% + 0.6px))"
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
                <button onClick={addcart} className="bg-black mt-5 w-[154px] text-white px-8 py-3 text-sm active:bg-gray-700">ADD TO CART</button>
                <div className="h-px bg-gray-200 w-4/5 mt-20"></div>
                <div>
                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1"><p>100% Original product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product
