import { useState } from "react"
import { useFilter } from "../context/FilterContext"
import { Tally3 } from "lucide-react"

function MainContent() {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } = useFilter()
  const [produects, setProducts] = useState<any[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [dropdownopen, setDropdownOpen] = useState<boolean>(false)
  const itemsPages = 12

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">

      <div className="mb-5">

        <div className="flex flex-col sm:flex-row justify-between items-center">

          <div className="relative mb-5 mt-5">

            <button className="border px-4 py-2 rounded-full flex items-center">

              <Tally3 className="mr-2" />
              {filter=='all'?"Filter":filter.charAt(0).toLowerCase()+filter.slice(1)}
            </button>
            {dropdownopen && (
              <div className="absolute
              bg-white border border-gray-300 rounded mt-2 w-full sm:w-40">
                <button
                onClick={()=>setFilter("cheap")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-200">
                  cheap
                </button>

                <button                   onClick={() => setFilter("expensive")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200">
                  Expensive
                </button>

                <button
                  onClick={() => setFilter("popular")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200">
                  Popular
                </button>



              </div>
            )}


          </div>
        </div>
      </div>


    </section>

  )
}

export default MainContent