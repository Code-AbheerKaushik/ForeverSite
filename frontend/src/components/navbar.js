import { assets } from '../assets/frontend_assets/assets'
import React, { useState, useEffect, useContext } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Search from './search'
import User from './user'
import { useNavigate } from 'react-router-dom'
import { CartContext } from './context'

function Navbar(props) {
    const navigate = useNavigate();
    const { cartNo, setcartarray, setCartTotal, setCartNo, setUserEmail } = useContext(CartContext);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const token = localStorage.getItem("auth-token");

    // Close drawer when ESC is pressed
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsDrawerOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Prevent background scrolling when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('guest-cart');
        setCartTotal(0);
        setcartarray([]);
        setCartNo(0);
        setUserEmail(null);
        setIsDrawerOpen(false);
        navigate('/login');
    };

    return (
        <>
            <div className='sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 flex flex-col items-center transition-all duration-300 shadow-sm'>
                <div className='w-full max-w-[1240px] flex gap-4 mx-auto my-3 md:my-5 items-center justify-between px-4 md:px-6'>
                    
                    {/* Hamburger Button (Mobile Only) */}
                    <button 
                        onClick={() => setIsDrawerOpen(true)}
                        className='md:hidden p-1.5 hover:bg-gray-100 rounded-md transition-colors'
                        aria-label="Open navigation menu"
                    >
                        <img src={assets.menu_icon} alt="menu" className='h-6 w-6' />
                    </button>

                    {/* Logo */}
                    <img 
                        onClick={() => navigate('/')} 
                        src={assets.logo} 
                        alt="logo" 
                        className='h-8 md:h-11 cursor-pointer select-none' 
                    />

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex space-x-7 justify-center items-center md:ml-16">
                        <NavLink to="/" className="flex flex-col items-center">
                            {({ isActive }) => (
                                <>
                                    <p className="text-[14px] font-medium text-gray-700 tracking-wide hover:text-black transition-colors">
                                        HOME
                                    </p>
                                    <div className={`w-2/3 h-[1.5px] bg-black mt-1 ${isActive ? "block" : "hidden"}`} />
                                </>
                            )}
                        </NavLink>

                        <NavLink to="/collection" className="flex flex-col items-center">
                            {({ isActive }) => (
                                <>
                                    <p className="text-[14px] font-medium text-gray-700 tracking-wide hover:text-black transition-colors">
                                        COLLECTION
                                    </p>
                                    <div className={`w-2/3 h-[1.5px] bg-black mt-1 ${isActive ? "block" : "hidden"}`} />
                                </>
                            )}
                        </NavLink>

                        <NavLink to="/about" className="flex flex-col items-center">
                            {({ isActive }) => (
                                <>
                                    <p className="text-[14px] font-medium text-gray-700 tracking-wide hover:text-black transition-colors">
                                        ABOUT
                                    </p>
                                    <div className={`w-2/3 h-[1.5px] bg-black mt-1 ${isActive ? "block" : "hidden"}`} />
                                </>
                            )}
                        </NavLink>

                        <NavLink to="/contact" className="flex flex-col items-center">
                            {({ isActive }) => (
                                <>
                                    <p className="text-[14px] font-medium text-gray-700 tracking-wide hover:text-black transition-colors">
                                        CONTACT
                                    </p>
                                    <div className={`w-2/3 h-[1.5px] bg-black mt-1 ${isActive ? "block" : "hidden"}`} />
                                </>
                            )}
                        </NavLink>
                    </div>

                    {/* Right side items */}
                    <div className='flex space-x-4 md:space-x-5 justify-center items-center text-gray-700 ml-auto md:ml-0'>
                        
                        {/* Search on Desktop (styled input) / Search trigger on Mobile */}
                        <div className="hidden md:block">
                            <Search searchtxt={props.searchtxt} setsearchtxt={props.setsearchtxt} />
                        </div>
                        
                        {/* Mobile Search Toggle Button */}
                        <button 
                            onClick={() => {
                                setIsSearchOpen(!isSearchOpen);
                                navigate('/collection');
                            }}
                            className="md:hidden p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Toggle search bar"
                        >
                            <img src={assets.search_icon} alt="search" className="h-6 w-6 cursor-pointer" />
                        </button>

                        <User />
                        
                        {/* Cart */}
                        <div onClick={() => navigate("/cart")} className='cartIcon cursor-pointer relative p-1 hover:bg-gray-100 rounded-md transition-colors'>
                            <img src={assets.cart_icon} alt="cart" className='h-6 w-6 cursor-pointer' />
                            <div className='absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                                {cartNo}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collapsible Mobile Search Input Bar */}
                {isSearchOpen && (
                    <div className="w-full md:hidden bg-gray-50 border-t border-b border-gray-200 py-3 px-4 transition-all duration-300">
                        <div className='w-full border border-gray-300 rounded-full py-2 px-4 shadow-sm flex bg-white items-center'>
                            <input
                                value={props.searchtxt}
                                onChange={(e) => props.setsearchtxt(e.target.value)}
                                type="text"
                                placeholder="Search for products..."
                                className="flex-1 outline-none text-gray-700 font-[Outfit] placeholder:text-gray-400 bg-transparent text-sm"
                                autoFocus
                            />
                            <img src={assets.search_icon} alt="search" className='w-4 h-4 cursor-pointer ml-2'/>
                        </div>
                    </div>
                )}

                <div className="h-px bg-gray-100 w-full max-w-[1240px]"></div>
            </div>

            {/* Left Mobile Drawer Backdrop Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsDrawerOpen(false)}
            />

            {/* Left Mobile Drawer */}
            <div className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <img src={assets.logo} alt="logo" className='h-8 select-none' />
                    <button 
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label="Close menu"
                    >
                        <img src={assets.cross_icon} alt="close" className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    <NavLink 
                        to="/" 
                        onClick={() => setIsDrawerOpen(false)}
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        HOME
                    </NavLink>
                    <NavLink 
                        to="/collection" 
                        onClick={() => setIsDrawerOpen(false)}
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        COLLECTION
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        onClick={() => setIsDrawerOpen(false)}
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        ABOUT
                    </NavLink>
                    <NavLink 
                        to="/contact" 
                        onClick={() => setIsDrawerOpen(false)}
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        CONTACT
                    </NavLink>
                    <NavLink 
                        to="/cart" 
                        onClick={() => setIsDrawerOpen(false)}
                        className={({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <span>CART</span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">{cartNo}</span>
                    </NavLink>

                    <div className="h-px bg-gray-100 my-4 mx-4"></div>

                    {token ? (
                        <>
                            <Link 
                                to="/profile"
                                onClick={() => setIsDrawerOpen(false)}
                                className="flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                PROFILE
                            </Link>
                            <Link 
                                to="/my-orders"
                                onClick={() => setIsDrawerOpen(false)}
                                className="flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                MY ORDERS
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                LOG OUT
                            </button>
                        </>
                    ) : (
                        <Link 
                            to="/login"
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            LOGIN / SIGNUP
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}

export default Navbar

