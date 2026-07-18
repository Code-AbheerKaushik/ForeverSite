import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { assets } from '../assets/frontend_assets/assets';
import { CartContext } from './context';
function User() {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");
  const { cartarray, setcartarray, setCartTotal, setCartNo, userEmail, setUserEmail } = useContext(CartContext);
  const ADMIN_EMAIL = "abheerkaushik2@gmail.com";
  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('guest-cart');
    navigate('/login')
    setCartTotal(0);
    setcartarray([]);
    setCartNo(0);
    setUserEmail(null);
  }
  if (!token) {
    return (
      <div>
        <img onClick={() => navigate("/login")} src={assets.profile_icon} alt="logo" className='h-6 cursor-pointer' />
      </div>
    )
  }
  else {
    return (
      <div className='group relative'>
        <img onClick={() => navigate("/profile")} src={assets.profile_icon} alt="logo" className='h-6 cursor-pointer' />
        {/* Absolute wrapper with group-hover trigger to keep it visible while moving mouse */}
        <div className='absolute right-0 pt-4 group-hover:block hidden z-50'>
          <div className='flex flex-col px-5 py-3 bg-slate-100 w-36 rounded shadow-md border border-gray-200 gap-2 text-sm'>
            {userEmail === ADMIN_EMAIL && (
              <>
                <p onClick={() => navigate("/admin")} className='hover:text-black text-gray-800 font-semibold cursor-pointer tracking-wide'>Admin Panel</p>
                <hr className='my-1.5 border-gray-300' />
              </>
            )}
            <p onClick={() => navigate("/profile")} className='hover:text-black text-gray-600 cursor-pointer transition-colors'>Profile</p>
            <p onClick={() => navigate("/my-orders")} className='hover:text-black text-gray-600 cursor-pointer transition-colors'>My orders</p>
            <p onClick={logout} className='hover:text-black text-gray-600 cursor-pointer transition-colors'>Log out</p>
          </div>
        </div>
      </div>

    )
  }
}

export default User
