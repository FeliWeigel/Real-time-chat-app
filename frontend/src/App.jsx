import { Route, Routes } from "react-router-dom"
import RegisterForm from "./components/RegisterForm"
import ChatArea from "./components/ChatArea"
import axios from "axios"

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<ChatArea/>}></Route>
      <Route exact path="/register" element={<RegisterForm/>}></Route>
    </Routes>
  )
}

export default App
