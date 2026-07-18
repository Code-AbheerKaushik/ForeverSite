import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
function Footer() {
    return (
        <>
            <div className='w-[1240px]  flex flex-col mx-auto mt-40  items-center justify-center'>
                <h2 className="font-[Outfit] text-[36px] font-medium text-gray-900">
                    Subscribe now & get 20% off
                </h2>

                <p className="font-[Outfit] text-[18px] text-gray-400 my-4">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
                <div className='flex'>
                    <input
                        placeholder="Enter your email"
                        className="font-[Outfit] text-base placeholder:text-gray-400 border px-3 w-[600px] border-gray-300 focus:border-gray-500 outline-none"
                    />

                    <button className="bg-black text-white text-[13px] font-medium tracking-wide uppercase px-14 py-5">
                        Subscribe
                    </button>
                </div>

                <div className='w-[1240px]  flex flex-col mx-auto mt-40 justify-between mb-20'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col w-[500px]'>
                            <img src={assets.logo} alt="logo" className='w-[145px] h-[35px]' />
                            <p className="w-[500px] text-gray-500 text-[14px] my-5 leading-8">
                                Lorem Ipsum is simply dummy text of the printing and typesetting
                                industry. Lorem Ipsum has been the industry's standard dummy text
                                ever since the 1500s, when an unknown printer took a galley of type
                                and scrambled it to make a type specimen book.
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-2xl font-medium text-gray-800 mb-5">
                                COMPANY
                            </h3>
                            <ul className="font-[Outfit] text-[18px] text-gray-500 space-y-3">
                                <li>Home</li>
                                <li>About us</li>
                                <li>Delivery</li>
                                <li>Privacy policy</li>
                            </ul>
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-2xl font-medium text-gray-800 mb-5">
                                GET IN TOUCH
                            </h3>
                            <div className="flex flex-col gap-2 text-gray-500 text-base">
                                <p>+1-212-456-7890</p>
                                <p>contact@foreveryou.com</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="py-5 text-[15px] text-center text-gray-500">
                        © 2024 forever.com - All Rights Reserved.
                    </p>
                </div>
            </div>
        </>
    )
}

export default Footer
