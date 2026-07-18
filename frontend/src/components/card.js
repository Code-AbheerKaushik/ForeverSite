import React from 'react'
import { useNavigate } from 'react-router'
import ImageWithSpinner from './ImageWithSpinner'
function Card(props) {
  const navigate = useNavigate();
  const productclick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    navigate(`/product/${props.product._id}`)
  }
  return (
    <div onClick={productclick} className='cursor-pointer'>
      <div className='overflow-hidden relative'>
        <ImageWithSpinner className="transition-transform duration-300 hover:scale-110 w-full h-full object-cover" src={props.product.image[0]} alt={props.product.name} />
      </div>
      <p className='mt-2 text-sm'>{props.product.name}</p>
      <p className='text-sm'>{`$${props.product.price}`}</p>
    </div>
  )
}

export default Card
