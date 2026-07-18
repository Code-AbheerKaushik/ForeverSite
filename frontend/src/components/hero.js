import React, { useEffect } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import Card from "./card";
import { useState } from 'react';
function Hero() {
    const [bestSellers, setBestSeller] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const getBsetSeller = async() => {
        try {
            const url = "http://localhost:8080/products/getbestseller";
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await res.json();
            setBestSeller(data.data);
        } catch (error) {
            console.log("error is fetching bestseller:", error);
        }
    };
const getLatestProducts = async () => {
    try {
        const url = "http://localhost:8080/products/getlatest";

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const data = await res.json();
        setLatestProducts(data.data)
    } catch (error) {
        console.log("error in fetching latestproducts:", error);
    }
};
useEffect(() => {
    getLatestProducts();
    getBsetSeller();
}, []);
return (
    <>
        <div className='flex mx-auto w-[1240px] border-2'>
            <div className='w-[620px] h-[400px] place-content-center'>

                <div className='flex justify-center text-sm font-medium text-gray-700 tracking-wide'>
                    --- OUR BESTSELLERS
                </div>
                <div className='flex justify-center text-6xl font-normal font-serif text-gray-700 my-2'>

                    Latest Arrivals
                </div>

                <div className='flex justify-center text-sm font-semibold text-gray-700 tracking-wide'>
                    SHOP NOW ---
                </div>

            </div>

            <img
                src={assets.hero_img}
                alt="logo"
                className='w-[620px] h-[400px] object-cover'
            />
        </div>
        <div className='w-[1240px] flex flex-col mx-auto my-10 items-center justify-center'>
            <div className='flex items-center gap-3'>
                <h2 className='text-4xl font-light tracking-[0.2em] text-stone-700 uppercase'>
                    Latest Collection
                </h2>
                <div className='w-20 h-[1px] bg-stone-500'></div>
            </div>
            <p className="font-[Outfit] text-[20px] text-gray-700 my-4">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.                </p  >
        </div>
        <div className='w-[1240px] mx-auto'>
            <div className="grid grid-cols-5 gap-4">
                {latestProducts.map(item => (
                    <Card key={item._id} product={item} />
                ))}
            </div>
        </div>
        <div className='w-[1240px] flex flex-col mx-auto my-10 items-center justify-center'>
            <div className='flex items-center gap-3'>
                <h2 className='text-4xl font-light tracking-[0.2em] text-stone-700 uppercase'>
                    Best Seller
                </h2>
                <div className='w-20 h-[1px] bg-stone-500'></div>
            </div>
            <p className="font-[Outfit] text-[20px] text-gray-700 my-4">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.                </p  >
        </div>
        <div className='w-[1240px] mx-auto'>
            <div className="grid grid-cols-5 gap-4">
                {bestSellers.map(item => (
                    <Card key={item._id} product={item} />
                ))}
            </div>
        </div>
        <div className="flex justify-around items-center mt-16 px-20  bg-white">

            <div className="flex flex-col items-center text-center">
                <img
                    src={assets.exchange_icon}
                    alt="Exchange Policy"
                    className="w-12 h-12 mb-4"
                />
                <h3 className="font-semibold text-lg text-gray-800">
                    Easy Exchange Policy
                </h3>
                <p className="text-gray-500 mt-2">
                    We offer hassle free exchange policy
                </p>
            </div>

            <div className="flex flex-col items-center text-center">
                <img
                    src={assets.quality_icon}
                    alt="Return Policy"
                    className="w-12 h-12 mb-4"
                />
                <h3 className="font-semibold text-lg text-gray-800">
                    7 Days Return Policy
                </h3>
                <p className="text-gray-500 mt-2">
                    We provide 7 days free return policy
                </p>
            </div>

            <div className="flex flex-col items-center text-center">
                <img
                    src={assets.support_img}
                    alt="Customer Support"
                    className="w-12 h-12 mb-4"
                />
                <h3 className="font-semibold text-lg text-gray-800">
                    Best customer support
                </h3>
                <p className="text-gray-500 mt-2">
                    We provide 24/7 customer support
                </p>
            </div>

        </div>
    </>
)
}

export default Hero 
