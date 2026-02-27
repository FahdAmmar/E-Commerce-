import { useEffect, useState } from "react"


interface Product {
    categories:string
}
interface FetchResponse {
    products:Product
}





function Slider() {
    const [categories, setCategories]=useState<string[]>([])
    const [keywords]=useState<string[]>([
        "apple",
        "watch",
        "Fashion",
        "trend",
        "shoes",
        "shirt",
    ])



    useEffect(()=>{
        const fetchCategories=async()=>{
            try{
                const response = await fetch('https://dummyjson.com/products')
                const data:FetchResponse= await response.json()
                console.log(data)

                const uniqCategories = [...new Set(data.products.flatMap(product => product.category))];
                console.log("categories",uniqCategories)



            }catch(error){
                console.error("Error fetching ",error)
            }
        }
        fetchCategories()
    },[])


  return (
    <aside className="w-64 p-5 h-screen">
        <h1 className="text=2xl font-bold mb-10 mt-4">React Store</h1>
        <section>
            <input type="text"
             className="border-2 rounded px-2 sm:mb-0"
             placeholder="Search Product">
            </input>
        </section>
    </aside>
  )
}

export default Slider