import React, { useEffect, useState } from 'react'
import Card from './card'

function Collection(props) {
  const [allProducts, setAllProducts] = useState();
  const [what, setWhat] = useState("none");
  const [category, setCategory] = useState(
    {
      "Men": false,
      "Women": false,
      "Kids": false
    }
  );
  const [subCategory, setSubCategory] = useState(
    {
      "Topwear": false,
      "Bottomwear": false,
      "Winterwear": false
    }
  );
  const sorting = (hello)=>{
    if(!hello)return;
    const array = [...hello]
    if(what==="low-high"){
        array.sort( (a, b) => a.price - b.price);
    }
    if(what==="high-low"){
       array.sort( (a, b) => b.price - a.price);
    }
    if(what==="none"){
        array.sort( (a, b) => a.id - b.id);
    }
    return array;
  }
  useEffect(()=>{if(allProducts)setAllProducts(sorting(allProducts))},[what]);
  const getFilteredProducts = async() => {
    let cat = [];
    let sub=[];
    let searchtxt = props.searchtxt
    if (category["Men"]) cat.push("Men");
    if (category["Women"]) cat.push("Women");
    if (category["Kids"]) cat.push("Kids");
    if (subCategory["Topwear"]) sub.push("Topwear");
    if (subCategory["Bottomwear"]) sub.push("Bottomwear");
    if (subCategory["Winterwear"]) sub.push("Winterwear");
    const url = `http://localhost:8080/products/filtered`;
      try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
                    cat,sub,searchtxt
                })
      })

      const response = await res.json();
      await setAllProducts(sorting(response.data));
  }
  catch (error) {
      console.log("error in getting products:", error)
    }
}
  const categoryClick = (c) => {
    setCategory(prev => ({
      ...prev,
      [c]: !prev[c]
    }));
  };
  const subClick = (c) => {
    setSubCategory(prev => ({
      ...prev,
      [c]: !prev[c]
    }));
  };
 useEffect(() => {
  getFilteredProducts().then(() => sorting());
}, [category, subCategory, props.searchtxt]);
  return (
    <div className='w-[1240px] flex mx-auto my-10 '>

      <div>
        <div className='flex flex-col w-60'>

          <p className='my-2 text-xl flex items-center font-[sans-serif] cursor-pointer gap-2'>
            FILTERS
          </p>

          <div className='border border-gray-300 pl-5 py-3 mt-6 '>
            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>

            <div>
              <div className='flex'>
                <input onClick={() => {
                  categoryClick("Men");
                }} className='mr-3 cursor-pointer' type="checkbox" />
                <p>Men</p>
              </div>

              <div className='flex'>
                <input onClick={() => {
                  categoryClick("Women");
                }} className='mr-3 cursor-pointer' type="checkbox" />
                <p>Women</p>
              </div>

              <div className='flex'>
                <input onClick={() => {
                  categoryClick("Kids");
                }} className='mr-3 cursor-pointer' type="checkbox" />
                <p>Kids</p>
              </div>
            </div>
          </div>

          <div className='border border-gray-300 pl-5 py-3 mt-6 '>
            <p className='mb-3 text-sm font-medium'>TYPE</p>

            <div>
              <div className='flex'>
                <input onClick={() => {
                  subClick("Topwear")
                }} className='mr-3 cursor-pointer' type="checkbox" />
                <p>Topwear</p>
              </div>

              <div className='flex'>
                <input onClick={() => {
                  subClick("Bottomwear")
                }} className='mr-3 cursor-pointer' type="checkbox" />
                <p>Bottomwear</p>
              </div>

              <div className='flex'>
                <input onClick={() => {
                  subClick("Winterwear")
                }} className='mr-3 cursor-pointer' type="checkbox" />
                <p>Winterwear</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className='flex flex-col'>

        <div className='flex h-[28] w-[979.4px] mx-[40px] justify-between'>
          <div className='flex gap-3 items-center'>
            <h2 className='text-xl font-light tracking-[0.2em] text-stone-700 uppercase'>
              ALL COLLECTIONS
            </h2>
            <div className='w-8 h-[1px] bg-stone-500'></div>
          </div>

          <div>
            <select onChange={(e)=>setWhat(e.target.value)} className='border-2 border-gray-300 text-sm font-[sans-serif] py-2 px-2'>
              <option value="none">Sort by: None</option>
              <option  value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
        </div>

        <div>
          <div className='mx-[40px] mt-6'>
            <div className="grid grid-cols-4 gap-4">
              {allProducts?.map(item => (
                <Card
                  key={item._id}
                  product={item}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Collection