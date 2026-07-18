import React, { useCallback } from 'react'
import { useNavigate } from 'react-router'
import ImageWithSpinner from './ImageWithSpinner'
const Card = React.memo(function Card({ product, priority = false }) {
  const navigate = useNavigate();
  const productclick = useCallback(() => {
    window.scrollTo(0, 0);
    navigate(`/product/${product._id}`, { state: { product } });
  }, [navigate, product]);
  return (
    <div onClick={productclick} className='cursor-pointer group flex flex-col h-full bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 p-2 sm:p-3'>
      <div className='overflow-hidden relative aspect-[3/4] w-full bg-gray-100 rounded'>
        <ImageWithSpinner loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className="transition-transform duration-500 group-hover:scale-105 w-full h-full object-cover" src={product.image[0]} alt={product.name} />
      </div>
      <div className='flex flex-col flex-1 mt-2.5 sm:mt-3 justify-between'>
        <p className='text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-tight group-hover:text-black transition-colors min-h-[2.5rem]'>{product.name}</p>
        <p className='text-sm sm:text-base font-semibold text-gray-900 mt-1'>{`$${product.price}`}</p>
      </div>
    </div>
  )
});

export default Card
