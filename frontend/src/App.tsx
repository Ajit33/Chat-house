
import './App.css'
import { Button } from './components/ui/button'

function App() {
  

  return (
  <div>
    <Button className='bg-red-300' onClick={()=>{console.log("hi")}}>click me </Button>
  </div>
  )
}

export default App
