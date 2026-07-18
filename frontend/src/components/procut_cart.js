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
        <div>
            <div className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">

                <div className="flex items-start gap-6">
                    <div className="w-16 sm:w-20 h-20 sm:h-24 overflow-hidden relative flex-shrink-0">
                        <ImageWithSpinner
                            className="w-full h-full object-cover"
                            alt=""
                            src={props.item.image[0]}
                        />
                    </div>

                    <div>
                        <p className="text-xs sm:text-lg font-medium">
                            {props.item.name}
                        </p>

                        <div className="flex items-center gap-5 mt-2">
                            <p>${props.item.price}</p>

                            {/* Size dropdown */}
                            <select
                                value={productsize}
                                onChange={sizechange}
                                className="px-2 py-1 border bg-slate-50 text-sm cursor-pointer"
                            >
                                {props.item.sizes && props.item.sizes.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Quantity input */}
                <input
                    value={productqty}
                    onChange={qtychange}
                    className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                    min="1"
                    type="number"
                />

                <img
                    onClick={deleteclick}
                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                    alt=""
                    src={assets.bin_icon}
                />
            </div>
        </div>
    )
}

export default Product_cart
