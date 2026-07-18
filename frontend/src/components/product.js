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
        <div className='w-full max-w-[1240px] mx-auto flex flex-col lg:flex-row my-6 md:my-10 px-4 gap-6 pb-20 md:pb-0 relative'>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            
            {/* Gallery Section */}
            <div className='flex flex-col lg:flex-row-reverse gap-4 w-full lg:w-1/2'>
                {/* Main Display Image */}
                <div className='w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-gray-50 relative overflow-hidden rounded-lg'>
                    <ImageWithSpinner className='w-full h-full object-cover' src={displayImg} alt={item.name} />
                </div>
                
                {/* Thumbnails Row/Column */}
                <div className='flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] scrollbar-thin py-1'>
                    {
                        item.image.map((i, index) => {
                            const isSelected = displayImg === i;
                            return (
                                <div 
                                    key={index} 
                                    onClick={() => imgclick(i)} 
                                    className={`w-[70px] sm:w-[90px] lg:w-[80px] shrink-0 aspect-square rounded-md overflow-hidden cursor-pointer relative border-2 transition-all ${isSelected ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <ImageWithSpinner src={i} alt='' className='w-full h-full object-cover' />
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* Info Section */}
            <div className='w-full lg:w-1/2 flex flex-col'>
                <h1 className='font-[Outfit] text-2xl sm:text-3xl font-medium text-gray-900 mt-2'>
                    {item.name}
                </h1>
                
                <div className="mt-3 flex items-center gap-1.5">
                    {reviews()}
                </div>

                <div className='my-4 text-2xl sm:text-3xl font-semibold text-gray-900'>
                    {`$${item.price}`}
                </div>
                
                <div className='text-sm sm:text-base text-gray-600 leading-relaxed w-full lg:w-11/12'>
                    {item.description}
                </div>

                <div className="mt-6">
                    <p className='text-sm font-semibold text-gray-800 uppercase tracking-wider mb-3'>
                        Select Size
                    </p>
                    <div className='flex flex-wrap gap-3'>
                        {["S", "M", "L", "XL", "XXL"].map(s => {
                            const available = item.sizes && item.sizes.includes(s);
                            const selected = size === s;
                            return (
                                <button
                                    key={s}
                                    onClick={() => available && setSize(s)}
                                    className={`
                                        relative w-12 h-12 flex items-center justify-center border font-medium text-sm rounded transition-all select-none
                                        ${available
                                            ? selected
                                                ? "border-black bg-black text-white shadow"
                                                : "bg-white border-gray-300 hover:border-gray-800 text-gray-800"
                                            : "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200"
                                        }
                                    `}
                                >
                                    {s}
                                    {!available && (
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
                </div>

                <button 
                    onClick={addcart} 
                    className="bg-black text-white w-full sm:w-[200px] mt-8 py-3.5 rounded-md font-semibold text-sm hover:bg-gray-900 active:bg-gray-800 transition-colors shadow-md"
                >
                    ADD TO CART
                </button>

                <div className="h-px bg-gray-200 w-full my-8"></div>
                
                <div className="text-sm text-gray-500 flex flex-col gap-2.5">
                    <p className="flex items-center gap-2">✓ 100% Original product.</p>
                    <p className="flex items-center gap-2">✓ Cash on delivery is available on this product.</p>
                    <p className="flex items-center gap-2">✓ Easy return and exchange policy within 7 days.</p>
                </div>
            </div>

            {/* Sticky Mobile Add To Cart Footer */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 px-4 flex items-center gap-4 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Price</span>
                    <span className="text-lg font-bold text-gray-900">${item.price}</span>
                </div>
                <button 
                    onClick={addcart} 
                    className="flex-1 bg-black text-white py-3 rounded-md font-semibold text-sm text-center shadow-md active:bg-gray-900"
                >
                    ADD TO CART
                </button>
            </div>
        </div>
    )
}

export default Product
