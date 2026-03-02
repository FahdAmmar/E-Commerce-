import { useEffect, useState } from "react"
import { useFilter } from "../context/FilterContext"
import { Tally3 } from "lucide-react"
import axios from "axios"
import BookCard from "./BookCard"

function MainContent() {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } = useFilter()
  const [produects, setProducts] = useState<any[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [dropdownopen, setDropdownOpen] = useState<boolean>(false)
  const itemsPages = 12

  useEffect(() => {
    let URL = `https://dummyjson.com/products?limit=${itemsPages}&skip=${(currentPage - 1) * itemsPages}`

    if (keyword) {
      URL = `https://dummyjson.com/products/search?q=${keyword}`
    }
    axios.get(URL).then(res => {
      setProducts(res.data.products)
      console.log(res.data.products)
    }).catch(error => {
      console.error("Error Fetching data ", error)
    })

  }, [keyword, currentPage])

  const getFilterProducts = () => {
    let filterproducts = produects

    if (selectedCategory) {
      filterproducts = filterproducts.filter((product) => product.category == selectedCategory)

      console.log(filterproducts)
    }

    if (minPrice !== undefined) {
      filterproducts = filterproducts.filter(pro => pro.price > minPrice)
    }
    if (maxPrice !== undefined) {
      filterproducts = filterproducts.filter(pro => pro.price < maxPrice)
    }
    if (searchQuery) {
      filterproducts = filterproducts.filter(pro =>
        pro.title.toLowerCase().includes(searchQuery.toLocaleLowerCase())
      )
    }

    switch (filter) {
      case 'expensive':
        return filterproducts.sort((a, b) => b.price - a.price)

      case 'cheap':
        return filterproducts.sort((a, b) => a.price - b.price)

      case 'popular':
        return filterproducts.sort((a, b) => b.rating - a.rating)

      default:
        return filterproducts
    }


  }

  const filterproducts = getFilterProducts()

  const totalProducts = 100;
  const totalpages = Math.ceil(totalProducts / itemsPages)
  const handlePageChange = (page: number) => {
    if (page > 0 && page < totalpages) {
      setCurrentPage(page)
    }

  }
  const getPaginationButtons = () => {
    const buttons: number[] = []
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalpages, currentPage + 2)

    if (currentPage - 2 < 1) {
      endPage = Math.min(totalpages, endPage + (2 - currentPage - 1))
    }

    if (currentPage + 2 > totalpages) {
      startPage = Math.min(1, startPage - (2 - totalpages - currentPage))
    }

    for (let page = startPage; page < endPage; page++) {
      buttons.push(page)
    }
    return buttons



  }


  return (
    <section className="w-[20rem] sm:w-[40rem] lg:w-[55rem] p-5 ">

      <div className="mb-5">

        <div className="flex flex-col ">

          <div className="relative mb-5 mt-5">

            <button onClick={() => setDropdownOpen(!dropdownopen)} className="border px-4 py-2 rounded-full flex items-center top-0">

              <Tally3 className="mr-2" />
              {filter == 'all' ? "Filter" : filter.charAt(0).toLowerCase() + filter.slice(1)}
            </button>
            {dropdownopen && (
              <div className="absolute 
              bg-white border border-gray-300 rounded mt-2 w-full sm:w-40">
                <button
                  onClick={() => setFilter("cheap")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200">
                  cheap
                </button>

                <button onClick={() => setFilter("expensive")}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
            {filterproducts.map(produect => (
              <BookCard key={produect.id}
                id={produect.id} title={produect.title}
                image={produect.thumbnail}
                price={produect.price} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-5">

            {/* previous */}

            <button onClick={() => handlePageChange(currentPage - 1)} className="border px-4 py-2 mx-2 rounded-full" disabled={currentPage == 1}>Previous </button>

            {/*123456*/}

            <div className="flex flex-wrap justify-center">
              {getPaginationButtons().map(page => (
                <button key={page} onClick={() => handlePageChange(page)}
                  className={`border px-4 py-2 mx-2 rounded-full ${page == currentPage ? 'bg-black' : 'bg-white'}`}>{page}</button>
              ))}
            </div>



            {/* next */}
            <button onClick={() => handlePageChange(currentPage + 1)} className="border px-4 py-2 mx-2 rounded-full" disabled={currentPage === totalpages} >Next</button>

          </div>


        </div>
      </div>
    </section >

  )
}

export default MainContent