import React, { useContext, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { CartContext } from './context'
import ImageWithSpinner from './ImageWithSpinner'
import { API_BASE_URL } from '../config'

function Product_cart(props) {
    const { cartarray, setcartarray, setCartNo } = useContext(CartContext)
    const [productqty, setproductqty] = useState(props.quantity)
    const [productsize, setproductsize] = useState(props.size)

    // Unified updater — call with whichever field changed
    const updateCartItem = async (newQty, newSize) => {
        const resolvedQty = newQty !== undefined ? Number(newQty) : productqty;
        const resolvedSize = newSize !== undefined ? newSize : productsize;

        const originalCart = [...cartarray];
        const originalQty = productqty;
        const originalSize = productsize;

        // --- Update local context state (handles size-merge for duplicates) ---
        let updatedCart;
        if (newSize !== undefined && newSize !== productsize) {
            // Check if target size already exists in the cart for this product
            const duplicateExists = cartarray.some(
                item => item.product._id === props.item._id && item.size === newSize
            );
            if (duplicateExists) {
                // Merge: add qty to the existing size row, remove old row
                updatedCart = cartarray
                    .map(item => {
                        if (item.product._id === props.item._id && item.size === newSize) {
                            return { ...item, quantity: item.quantity + resolvedQty };
                        }
                        return item;
                    })
                    .filter(item => !(item.product._id === props.item._id && item.size === productsize));
            } else {
                // No duplicate — just change the size
                updatedCart = cartarray.map(item =>
                    (item.product._id === props.item._id && item.size === productsize)
                        ? { ...item, size: newSize, quantity: resolvedQty }
                        : item
                );
            }
        } else {
            // Quantity-only update
            updatedCart = cartarray.map(item =>
                (item.product._id === props.item._id && item.size === productsize)
                    ? { ...item, quantity: resolvedQty }
                    : item
            );
        }

        setcartarray(updatedCart);
        setCartNo(updatedCart.length);
        if (newSize !== undefined) setproductsize(newSize);
        if (newQty !== undefined) setproductqty(resolvedQty);

        // --- Persist ---
        if (!localStorage.getItem("auth-token")) {
            localStorage.setItem("guest-cart", JSON.stringify(updatedCart));
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/products/updatecart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("auth-token")
                },
                body: JSON.stringify({
                    productId: props.item._id,
                    currentSize: productsize,
                    newQuantity: resolvedQty,
                    newSize: newSize !== undefined ? newSize : undefined
                })
            });

            if (!res.ok) {
                throw new Error("Failed to update cart on server");
            }
        } catch (error) {
            console.log("Error updating cart item:", error);
            setcartarray(originalCart);
            setCartNo(originalCart.length);
            setproductsize(originalSize);
            setproductqty(originalQty);
            alert("Failed to update cart. Please try again.");
        }
    };

    const qtychange = (e) => {
        updateCartItem(Number(e.target.value), undefined);
    };

    const sizechange = (e) => {
        updateCartItem(undefined, e.target.value);
    };

    const deleteclick = async () => {
        const originalCart = [...cartarray];

        const updatedCart = cartarray.filter(
            item => !(props.item._id === item.product._id && props.size === item.size)
        );
        setcartarray(updatedCart);
        setCartNo(updatedCart.length);

        if (!localStorage.getItem("auth-token")) {
            localStorage.setItem("guest-cart", JSON.stringify(updatedCart));
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/products`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("auth-token")
                },
                body: JSON.stringify({ id: props.item._id, size: props.size })
            });

            if (!res.ok) {
                throw new Error("Failed to delete product from server");
            }
        } catch (error) {
            console.log("Error deleting product:", error);
            setcartarray(originalCart);
            setCartNo(originalCart.length);
            alert("Failed to delete item. Please try again.");
        }
    };

    if (!props.item) return null;

    return (
        <div className="py-4 border-b border-gray-150 text-gray-700">
            {/* Mobile-first Stacked Card Layout (< sm) */}
            <div className="flex sm:hidden gap-4 items-start w-full relative">
                {/* Product Image */}
                <div className="w-20 h-24 overflow-hidden relative rounded-md bg-gray-50 flex-shrink-0">
                    <ImageWithSpinner
                        className="w-full h-full object-cover"
                        alt={props.item.name}
                        src={props.item.image[0]}
                    />
                </div>

                {/* Details & Actions Container */}
                <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug pr-6">
                                {props.item.name}
                            </p>
                            <button 
                                onClick={deleteclick} 
                                className="absolute top-0 right-0 p-1 hover:bg-gray-100 rounded transition-colors"
                                aria-label="Remove item"
                            >
                                <img
                                    className="w-4 h-4"
                                    alt="delete"
                                    src={assets.bin_icon}
                                />
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="text-sm font-semibold text-gray-900">${props.item.price}</span>
                            <span className="text-xs text-gray-400">|</span>
                            
                            {/* Size selector */}
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">Size:</span>
                                <select
                                    value={productsize}
                                    onChange={sizechange}
                                    className="px-1.5 py-0.5 border border-gray-300 rounded bg-slate-50 text-xs font-medium cursor-pointer outline-none"
                                >
                                    {props.item.sizes && props.item.sizes.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2.5 mt-2">
                        <span className="text-xs text-gray-500 font-medium">Qty:</span>
                        <div className="flex items-center border border-gray-300 rounded bg-white">
                            <button 
                                onClick={() => productqty > 1 && updateCartItem(productqty - 1, undefined)}
                                className="px-2 py-1 text-gray-500 hover:text-black font-semibold text-sm transition-colors border-r"
                            >
                                -
                            </button>
                            <input
                                value={productqty}
                                onChange={qtychange}
                                className="w-10 text-center text-sm font-semibold outline-none py-0.5 bg-transparent"
                                min="1"
                                type="number"
                            />
                            <button 
                                onClick={() => updateCartItem(productqty + 1, undefined)}
                                className="px-2 py-1 text-gray-500 hover:text-black font-semibold text-sm transition-colors border-l"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Row Grid Layout (>= sm) */}
            <div className="hidden sm:grid grid-cols-[4fr_2fr_0.5fr] items-center gap-4 w-full">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-24 overflow-hidden relative rounded-md bg-gray-50 flex-shrink-0">
                        <ImageWithSpinner
                            className="w-full h-full object-cover"
                            alt={props.item.name}
                            src={props.item.image[0]}
                        />
                    </div>

                    <div>
                        <p className="text-base font-semibold text-gray-800 leading-tight">
                            {props.item.name}
                        </p>

                        <div className="flex items-center gap-5 mt-2.5">
                            <span className="text-lg font-bold text-gray-900">${props.item.price}</span>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Size:</span>
                                <select
                                    value={productsize}
                                    onChange={sizechange}
                                    className="px-2 py-1 border border-gray-300 rounded bg-slate-50 text-sm font-medium cursor-pointer"
                                >
                                    {props.item.sizes && props.item.sizes.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quantity Input */}
                <div className="flex items-center justify-start pl-4">
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                        <button 
                            onClick={() => productqty > 1 && updateCartItem(productqty - 1, undefined)}
                            className="px-3 py-1.5 text-gray-500 hover:text-black font-semibold transition-colors border-r"
                        >
                            -
                        </button>
                        <input
                            value={productqty}
                            onChange={qtychange}
                            className="w-12 text-center text-sm font-semibold outline-none py-1 bg-transparent"
                            min="1"
                            type="number"
                        />
                        <button 
                            onClick={() => updateCartItem(productqty + 1, undefined)}
                            className="px-3 py-1.5 text-gray-500 hover:text-black font-semibold transition-colors border-l"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Delete button */}
                <button 
                    onClick={deleteclick} 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex justify-center items-center ml-auto"
                    aria-label="Remove item"
                >
                    <img
                        className="w-5 h-5 cursor-pointer"
                        alt="delete"
                        src={assets.bin_icon}
                    />
                </button>
            </div>
        </div>
    )
}

export default Product_cart
