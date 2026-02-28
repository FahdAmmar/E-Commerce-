import { Route,Routes } from "react-router-dom"
import Slider from "./components/Slider"
import MainContent from "./components/MainContent"


function App() {
  return (
    <main className="w-screen h-screen flex overflow-x-hidden">
      <Slider/>
      <div className="rounded w-full flex justify-between flex-wrap">
        <Routes>
          <Route path="/" element={<MainContent/>}></Route>
          
        </Routes>

      </div>
    </main>
   
  )
}

export default App