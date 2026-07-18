import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
function Footer() {
    return (
        <>
            <div className='w-full max-w-[1240px] flex flex-col mx-auto mt-20 md:mt-40 items-center justify-center px-4'>
                <h2 className="font-[Outfit] text-[24px] md:text-[36px] font-medium text-gray-900 text-center">
                    Subscribe now & get 20% off
                </h2>

                <p className="font-[Outfit] text-[14px] md:text-[18px] text-gray-400 my-4 text-center">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
                <div className='flex flex-col sm:flex-row w-full max-w-[600px] gap-2.5 sm:gap-0 mt-2'>
                    <input
                        placeholder="Enter your email"
                        className="font-[Outfit] text-base placeholder:text-gray-400 px-4 py-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded sm:rounded-r-none transition-colors"
                    />

                    <button className="bg-black text-white text-[13px] font-semibold tracking-widest uppercase px-8 py-3.5 rounded sm:rounded-l-none hover:bg-gray-900 active:bg-gray-800 transition-colors shadow-sm shrink-0">
                        Subscribe
                    </button>
                </div>

                <div className='w-full max-w-[1240px] flex flex-col mx-auto mt-16 md:mt-24 justify-between mb-16'>
                    <div className='flex flex-col md:flex-row gap-10 md:gap-20 justify-between w-full text-left'>
                        <div className='flex flex-col w-full max-w-[500px]'>
                            <img src={assets.logo} alt="logo" className='w-[145px] h-[35px] select-none' />
                            <p className="w-full text-gray-500 text-sm my-4 leading-7">
                                Lorem Ipsum is simply dummy text of the printing and typesetting
                                industry. Lorem Ipsum has been the industry's standard dummy text
                                ever since the 1500s, when an unknown printer took a galley of type
                                and scrambled it to make a type specimen book.
                            </p>
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 tracking-wider uppercase">
                                COMPANY
                            </h3>
                            <ul className="font-[Outfit] text-sm text-gray-500 space-y-3.5">
                                <li className="hover:text-black cursor-pointer transition-colors">Home</li>
                                <li className="hover:text-black cursor-pointer transition-colors">About us</li>
                                <li className="hover:text-black cursor-pointer transition-colors">Delivery</li>
                                <li className="hover:text-black cursor-pointer transition-colors">Privacy policy</li>
                            </ul>
                        </div>
                        <div className='flex flex-col'>
                            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 tracking-wider uppercase">
                                GET IN TOUCH
                            </h3>
                            <div className="flex flex-col gap-3 text-gray-500 text-sm">
                                <p className="hover:text-black cursor-pointer transition-colors">+1-212-456-7890</p>
                                <p className="hover:text-black cursor-pointer transition-colors">contact@foreveryou.com</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full border-t border-gray-100 mt-6">
                    <p className="py-4 text-xs md:text-sm text-center text-gray-500">
                        © 2024 forever.com - All Rights Reserved.
                    </p>
                </div>
            </div>
        </>
    )
}

export default Footer
