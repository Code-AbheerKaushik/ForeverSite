import { assets } from '../assets/frontend_assets/assets'
import React from 'react'
import { NavLink } from 'react-router-dom'
import Search from './search'
import User from './user'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from './context'
function Navbar(props) {
    const navigate = useNavigate();
    const { cartNo } = useContext(CartContext);
    return (
        <>
            <div className='sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 flex flex-col items-center transition-all duration-300'>
                <div className='w-[1240px] flex mx-auto my-5 items-center justify-between'>
                    <img src={assets.logo} alt="logo" className='h-11' />
                    <div className="flex space-x-7 justify-center ml-16 ">

                        <NavLink to="/" className="flex flex-col items-center">
                            {({ isActive }) => (
                                <>
                                    <p className="text-[15px] font-medium text-gray-700 tracking-wide">
                                        HOME
                                    </p>
                                    <div
                                        className={`w-2/3 h-[1px] bg-black mt-1 ${isActive ? "block" : "hidden"
                                            }`}
                                    />
                                </>
                            )}
                        </NavLink>

                        <NavLink to="/collection" className="flex flex-col items-center">
                            {({ isActive }) => (
                                <>
                                    <p className="text-[15px] font-medium text-gray-700 tracking-wide">
                                        COLLECTION
                                    </p>
                                    <div
                                        className={`w-2/3 h-[1px] bg-black mt-1 ${isActive ? "block" : "hidden"
                                            }`}
                                    />
                                </>
                            )}
                        </NavLink>

                        <NavLink to="/about" className="flex flex-col items-center">
                            {({ isActive }) => (
                                <>
                                    <p className="text-[15px] font-medium text-gray-700 tracking-wide">
                                        ABOUT
                                    </p>
                                    <div
                                        className={`w-2/3 h-[1px] bg-black mt-1 ${isActive ? "block" : "hidden"
                                            }`}
                                    />
                                </>
                            )}
                        </NavLink>

                        <NavLink to="/contact" className="flex flex-col items-center">
                            {({ isActive }) => (
                                <>
                                    <p className="text-[15px] font-medium text-gray-700 tracking-wide">
                                        CONTACT
                                    </p>
                                    <div
                                        className={`w-2/3 h-[1px] bg-black mt-1 ${isActive ? "block" : "hidden"
                                            }`}
                                    />
                                </>
                            )}
                        </NavLink>

                    </div>
                    <div className='flex space-x-4 justify-center items-center text-gray-300'>
                        <Search searchtxt={props.searchtxt} setsearchtxt={props.setsearchtxt} />
                        <User />
                        <div onClick={() => navigate("/cart")} className='cartIcon cursor-pointer'>
                            <img src={assets.cart_icon} alt="logo" className='h-6 cursor-pointer ' />
                            <div className='bg-black rounded-full w-5 h-5 flex items-center justify-center cartNo'>
                                <span>
                                    {cartNo}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gray-200 w-[1240px]"></div>
            </div>
        </>
    )
}

export default Navbar

