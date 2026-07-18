import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
function Contact() {
    return (
        <>
            <div className='w-[1240px] flex mx-auto my-10 items-center justify-center'>
                <div className='flex items-center gap-3'>
                    <h2 className='text-xl font-light tracking-[0.2em] text-stone-700 uppercase'>
                        Contact Us
                    </h2>
                    <div className='w-8 h-[1px] bg-stone-500'></div>
                </div>
            </div>
            <div className='flex justify-center'>
                <img src={assets.contact_img} alt="logo" className='w-[520px] h-[520px] mr-7' />
                <div className="flex flex-col justify-center items-start gap-6 max-w-[380px]">
                    <p className="text-2xl font-semibold text-gray-700">
                        Our Store
                    </p>

                    <p className="text-base text-gray-500 leading-7">
                        Aravail Hostel, sector 12, chd
                    </p>

                    <p className="text-base text-gray-500 leading-7">
                        Tel: 123- blah blah 123
                        <br />
                        Email: blah@blah.com
                    </p>

                    <p className="text-2xl font-semibold text-gray-700">
                        Careers at Forever
                    </p>

                    <p className="text-base text-gray-500 leading-7">
                        Learn more about our teams and job openings.
                    </p>

                    <button className="border border-black px-8 py-4 text-base font-medium hover:bg-black hover:text-white transition-all duration-500">
                        Explore Jobs
                    </button>
                </div>
            </div>
        </>
    )
}

export default Contact