import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
function About() {
    return (
        <div className="max-w-[1240px] mx-auto px-4">
            <div className="flex justify-center items-center gap-3 my-12">
                <h2 className="text-xl font-light tracking-wide text-stone-700 uppercase">
                    About Us
                </h2>
                <div className="w-10 h-px bg-stone-500"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-16 mt-12">

                <img
                    src={assets.about_img}
                    alt=""
                    className="w-[480px] h-[500px] object-cover"
                />

                <div className="flex flex-col justify-center max-w-[620px]">

                    <p className="text-[17px] leading-9 text-gray-600">
                        Forever was born out of a passion for innovation and a desire
                        to revolutionize the way people shop online. Our journey began
                        with a simple idea: to provide a platform where customers can
                        easily discover, explore, and purchase a wide range of products
                        from the comfort of their homes.
                    </p>

                    <p className="mt-8 text-[17px] leading-9 text-gray-600">
                        Since our inception, we've worked tirelessly to curate a diverse
                        selection of high-quality products that cater to every taste and
                        preference. From fashion and beauty to electronics and home
                        essentials, we offer an extensive collection sourced from trusted
                        brands and suppliers.
                    </p>

                    <h3 className="mt-10 text-[26px] font-semibold text-gray-800">
                        Our Mission
                    </h3>

                    <p className="mt-6 text-[17px] leading-9 text-gray-600">
                        Our mission at Forever is to empower customers with choice,
                        convenience, and confidence. We're dedicated to providing a
                        seamless shopping experience that exceeds expectations, from
                        browsing and ordering to delivery and beyond.
                    </p>

                </div>

            </div>

            <div className="flex items-center gap-3 mt-24 mb-10">
                <h2 className="text-2xl font-light text-stone-700 uppercase">
                    Why Choose Us
                </h2>
                <div className="w-10 h-px bg-stone-500"></div>
            </div>

            <div className="flex flex-col md:flex-row text-sm">

                <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5">
                    <b className="text-base">Quality Assurance:</b>
                    <p className="text-gray-600 leading-7">
                        We meticulously select and vet each product to ensure it meets
                        our stringent quality standards.
                    </p>
                </div>

                <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5">
                    <b className="text-base">Convenience:</b>
                    <p className="text-gray-600 leading-7">
                        With our user-friendly interface and hassle-free ordering
                        process, shopping has never been easier.
                    </p>
                </div>

                <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5">
                    <b className="text-base">Exceptional Customer Service:</b>
                    <p className="text-gray-600 leading-7">
                        Our team of dedicated professionals is here to assist you
                        every step of the way, ensuring your satisfaction is our
                        top priority.
                    </p>
                </div>

            </div>

        </div>
    )
}

export default About
