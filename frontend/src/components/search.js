import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { useState } from 'react';
import { useNavigate } from 'react-router';
function Search(props){
    const navigate = useNavigate();
    const onChange=(e)=>{
        props.setsearchtxt(e.target.value);
    }
    return (
        <div className='w-full max-w-[200px] sm:max-w-[300px] border border-gray-300 rounded-full py-2 px-3 sm:py-3 sm:px-4 shadow-inner flex'>
            <input
                value={props.searchtxt}
                onChange={onChange}
                onClick={()=>{navigate("/collection")}}
                type="text"
                placeholder="Search for products..."
                className="flex-1 outline-none text-gray-700 font-[Outfit] placeholder:text-gray-400 bg-transparent"
            />
            <img src={assets.search_icon} alt="logo"  className='w-5 mr-2 cursor-pointer'/>
        </div>
    )
}

export default Search
