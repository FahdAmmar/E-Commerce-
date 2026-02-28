import { useEffect, useState } from "react"
import { useFilter } from "../context/FilterContext"

interface Product {
    categories:string
}
interface FetchResponse {
    products:Product
}





function Slider() {
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        keyword,
        setKeyword,
    }=useFilter();
    const [categories, setCategories]=useState<string[]>([])
    const [keywords]=useState<string[]>([
        "apple",
        "watch",
        "Fashion",
        "trend",
        "shoes",
        "shirt",
    ])
    const [activeKeyword, setActiveKeyword] = useState<string|null>(null);


    useEffect(()=>{
        const fetchCategories=async()=>{
            try{
                const response = await fetch('https://dummyjson.com/products')
                const data:FetchResponse= await response.json()
                console.log(data)

                const uniqCategories:string[] = [...new Set(data.products.flatMap(product => product.category))];
                setCategories(uniqCategories)



            }catch(error){
                console.error("Error fetching ",error)
            }
        }
        fetchCategories()
    },[])

    const handleMinPrice =(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.target.value;
        setMinPrice(value? parseFloat(value):undefined)
    }

    const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMaxPrice(value ? parseFloat(value) : undefined)
    }

    const handleRadioChangecategories =(category:string)=>{
    setSelectedCategory(category)
    }

    const handleKeywordClick=(keyword:string)=>{
        setKeyword(keyword);
        setActiveKeyword(keyword);
    }

    const handleResetFilter=()=>{

        setSearchQuery("")
        setSelectedCategory("")
        setMinPrice(undefined)
        setMaxPrice(undefined)
        setKeyword("")

    }


  return (
    <aside className="w-64 p-5 h-screen">
        <h1 className="text=2xl font-bold mb-10 mt-4">React Store</h1>
        <section>
            <input type="text"
             className="border-2 rounded px-2 sm:mb-0"
             placeholder="Search Product"
             value={searchQuery}
             onChange={(e)=>setSearchQuery(e.target.value)}>
            </input>
            <div className="flex justify-center items-center">
                <input type="text" className="border-2 mr-2 px-5 py-3 w-full "
                placeholder="Min"
                value={minPrice ?? ""}
                onChange={handleMinPrice}/>
                

                <input type="text" className="border-2 mr-2 px-5 py-3 w-full "
                 placeholder="Max"
                value={maxPrice??""}
                onChange={handleMaxPrice} />

            </div>
            {/*Categories section*/}
            <div className="mb-5">
                <h2 className="text-xl font-semibold mb-3">categories</h2>
            </div>
            <div>
            {categories.map((category,index)=>(
                <label key={index} className="block mb-2">
                    <input type="radio" name="category"
                    value={category} 
                    className="mr-2 w-\[16px\] h-\[16px\]"
                        onChange={() => handleRadioChangecategories(category)}
                        checked={selectedCategory==category}/>
                    {category.toLocaleUpperCase()}
                </label>
            ))}
            </div>
            {/*keywords section*/}
            <div className="my-5">
                <h2 className="text-xl font-semibold mb-3">Keywords</h2>
                <div>
                    {keywords.map((keyword ,index)=>(
                        <button key={index}
                            className={`block mb-2 px-4 min-w-full text-left
                         border rounded ${activeKeyword === keyword ?'bg-gray-200': 'hover:bg-gray-200'}`}
                         onClick={()=>handleKeywordClick(keyword)}> 
                         {keyword.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <button onClick={(handleResetFilter)} className="w-full mb-16 py-2 bg-black text-white mt-5">Reset Filters</button>




        </section>
    </aside>
  )
}

export default Slider