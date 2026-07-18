import React, { useEffect, useState } from 'react'
import Product_cart from './procut_cart'
import { useContext } from 'react'
import { useNavigate } from 'react-router';
import { CartContext } from './context';
import { API_BASE_URL } from '../config';
function Cart() {
    const navigate = useNavigate();
    const {cartarray,setcartarray,cartTotal,setCartTotal }=useContext(CartContext)
    let cartprice = 0;
    const getcart=async()=>{
        if(!localStorage.getItem("auth-token")){
            let guestCart = [];
            try {
                guestCart = JSON.parse(localStorage.getItem("guest-cart")) || [];
            } catch(e) {
                guestCart = [];
            }
            setcartarray(guestCart);
            return;
        }
        const url =`${API_BASE_URL}/products/getcart`
        try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem("auth-token")
        },
      })
      const data = await res.json();
      setcartarray(data.data || [])
  }
  catch (error) {
      console.log("error in getting products:", error)
      setcartarray([])
    }
    }
    useEffect(()=>{
        getcart();
},[])
useEffect(() => {
    const total = cartarray.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
    }, 0);

    setCartTotal(total);
}, [cartarray]);
    return (
        <div className="pt-14 w-full max-w-[1240px] flex flex-col mx-auto my-10 px-4">
  <div className="text-2xl mb-3">
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-gray-500">
        YOUR <span className="text-gray-700 font-medium">CART</span>
      </p>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
    </div>
  </div>
  <div className='flex flex-col'>
 {
    
 cartarray?.map((item)=>{
    return(

        <Product_cart cartTotal={cartTotal} setCartTotal={setCartTotal} key={item._id} item={item.product} quantity={item.quantity} size={item.size}/>
    )
    })
        
    }
  </div>
       
  <div className="flex justify-end my-20">
    <div className="w-full sm:w-[450px]">
      <div className="w-full">
        <div className="text-2xl">
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-500">
              CART <span className="text-gray-700 font-medium">TOTALS</span>
            </p>
            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
          </div>
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

      <div className="w-full text-end">
        <button 
          onClick={() => cartarray.length > 0 && navigate("/checkout")} 
          disabled={cartarray.length === 0}
          className={`text-sm my-8 px-8 py-3 transition-colors duration-200 ${
            cartarray.length === 0 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-black text-white active:bg-gray-800 hover:bg-gray-900"
          }`}
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  </div>
</div>
    )
}

export default Cart
