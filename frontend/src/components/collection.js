import React, { useEffect, useState } from 'react'
import Card from './card'
import { API_BASE_URL } from '../config'

function Collection(props) {
  const [allProducts, setAllProducts] = useState();
  const [what, setWhat] = useState("none");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [category, setCategory] = useState({
    "Men": false,
    "Women": false,
    "Kids": false
  });
  const [subCategory, setSubCategory] = useState({
    "Topwear": false,
    "Bottomwear": false,
    "Winterwear": false
  });

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
    const url = `${API_BASE_URL}/products/filtered`;
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
      setAllProducts(sorting(response.data));
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

  const activeFiltersCount = Object.values(category).filter(Boolean).length + Object.values(subCategory).filter(Boolean).length;

  const renderFiltersContent = () => (
    <div className='flex flex-col gap-6'>
      <div className='border border-gray-200 pl-5 py-4 bg-white rounded-lg shadow-sm'>
        <p className='mb-3 text-sm font-semibold text-gray-800 uppercase tracking-wider'>CATEGORIES</p>
        <div className='flex flex-col gap-2.5 text-sm text-gray-600'>
          {["Men", "Women", "Kids"].map(c => (
            <label key={c} className='flex items-center gap-3 cursor-pointer select-none'>
              <input 
                checked={category[c]} 
                onChange={() => categoryClick(c)} 
                className='w-4 h-4 cursor-pointer accent-black' 
                type="checkbox" 
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='border border-gray-200 pl-5 py-4 bg-white rounded-lg shadow-sm'>
        <p className='mb-3 text-sm font-semibold text-gray-800 uppercase tracking-wider'>TYPE</p>
        <div className='flex flex-col gap-2.5 text-sm text-gray-600'>
          {["Topwear", "Bottomwear", "Winterwear"].map(s => (
            <label key={s} className='flex items-center gap-3 cursor-pointer select-none'>
              <input 
                checked={subCategory[s]} 
                onChange={() => subClick(s)} 
                className='w-4 h-4 cursor-pointer accent-black' 
                type="checkbox" 
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className='w-full max-w-[1240px] flex flex-col md:flex-row mx-auto my-6 md:my-10 px-4 gap-6 min-h-screen relative'>
      
      {/* Desktop Filter Sidebar */}
      <div className='hidden md:block w-60 shrink-0'>
        <p className='my-2 text-lg font-bold text-gray-800 tracking-wider uppercase'>
          FILTERS
        </p>
        <div className="mt-4">
          {renderFiltersContent()}
        </div>
      </div>

      {/* Main product area */}
      <div className='flex flex-col flex-1 min-w-0'>
        
        {/* Top Controls Row */}
        <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-4 border-b border-gray-100'>
          <div className='flex gap-3 items-center'>
            <h2 className='text-lg sm:text-xl font-light tracking-[0.2em] text-stone-700 uppercase'>
              ALL COLLECTIONS
            </h2>
            <div className='w-8 h-[1px] bg-stone-500'></div>
          </div>

          <div className='flex gap-3 w-full sm:w-auto items-center justify-between sm:justify-end'>
            {/* Mobile Filter Toggle Button */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden border border-gray-300 rounded px-4 py-2 text-sm font-medium flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
            >
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <select 
              value={what}
              onChange={(e)=>setWhat(e.target.value)} 
              className='border border-gray-300 rounded text-sm py-2 px-3 bg-white font-medium text-gray-700 outline-none focus:border-black transition-colors'
            >
              <option value="none">Sort by: Relevancy</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className='mt-6'>
          {allProducts && allProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {allProducts?.map(item => (
                <Card key={item._id} product={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 md:hidden ${isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileFilterOpen(false)}
      />

      {/* Mobile Filters Drawer Panel */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-80 bg-slate-50 shadow-2xl transition-transform duration-300 transform md:hidden ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <span className="text-lg font-bold text-gray-800">Filters</span>
          <button 
            onClick={() => setIsMobileFilterOpen(false)}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {renderFiltersContent()}
        </div>
        <div className="p-4 border-t border-gray-200 bg-white flex gap-3">
          <button 
            onClick={() => {
              setCategory({ "Men": false, "Women": false, "Kids": false });
              setSubCategory({ "Topwear": false, "Bottomwear": false, "Winterwear": false });
            }}
            className="flex-1 border border-gray-300 py-2.5 rounded font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button 
            onClick={() => setIsMobileFilterOpen(false)}
            className="flex-1 bg-black text-white py-2.5 rounded font-semibold text-sm hover:bg-gray-900 transition-colors shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>

    </div>
  )
}

export default Collection