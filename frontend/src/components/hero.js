import React, { useEffect } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import Card from "./card";
import { useState } from 'react';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';
function Hero() {
    const [bestSellers, setBestSeller] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const getBsetSeller = async() => {
        try {
            const url = `${API_BASE_URL}/products/getbestseller`;
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
        const url = `${API_BASE_URL}/products/getlatest`;

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
        <div className='flex flex-col md:flex-row mx-auto w-full max-w-[1240px] border border-gray-200'>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center py-12 md:py-0 h-auto min-h-[250px] md:h-[450px] px-6 text-center md:text-left md:items-start md:pl-24'>
                <div className='flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 tracking-widest uppercase'>
                    <span className="w-8 h-[1px] bg-gray-700 hidden md:inline-block"></span> OUR BESTSELLERS
                </div>
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 my-3 leading-tight font-normal'>
                    Latest Arrivals
                </h1>
                <Link to="/collection" className='flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-700 tracking-widest uppercase hover:text-black transition-colors cursor-pointer group'>
                    SHOP NOW <span className="w-8 h-[1px] bg-gray-700 group-hover:w-12 transition-all"></span>
                </Link>
            </div>

            <img
                src={assets.hero_img}
                alt="hero"
                className='w-full md:w-1/2 h-[250px] sm:h-[350px] md:h-[450px] object-cover'
            />
        </div>
        <div className='w-full max-w-[1240px] flex flex-col mx-auto my-10 items-center justify-center px-4 text-center'>
            <div className='flex items-center gap-3'>
                <h2 className='text-2xl md:text-4xl font-light tracking-[0.2em] text-stone-700 uppercase'>
                    Latest Collection
                </h2>
                <div className='w-20 h-[1px] bg-stone-500'></div>
            </div>
            <p className="font-[Outfit] text-[16px] md:text-[20px] text-gray-700 my-4">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.                </p  >
        </div>
        <div className='w-full max-w-[1240px] mx-auto px-4'>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {latestProducts.map(item => (
                    <Card key={item._id} product={item} />
                ))}
            </div>
        </div>
        <div className='w-full max-w-[1240px] flex flex-col mx-auto my-10 items-center justify-center px-4 text-center'>
            <div className='flex items-center gap-3'>
                <h2 className='text-2xl md:text-4xl font-light tracking-[0.2em] text-stone-700 uppercase'>
                    Best Seller
                </h2>
                <div className='w-20 h-[1px] bg-stone-500'></div>
            </div>
            <p className="font-[Outfit] text-[16px] md:text-[20px] text-gray-700 my-4">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.                </p  >
        </div>
        <div className='w-full max-w-[1240px] mx-auto px-4'>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {bestSellers.map(item => (
                    <Card key={item._id} product={item} />
                ))}
            </div>
        </div>
        <div className="flex flex-col md:flex-row justify-around items-center gap-8 mt-16 px-4 md:px-20 py-8 bg-white">

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
