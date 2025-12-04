import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Skyapp } from './Skyapp/Sky'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Skyapp></Skyapp>
    </>
  )
}

export default App
