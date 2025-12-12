import { Routes, Route } from "react-router-dom"
import MoviePage from "./pages/MoviePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MoviePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

      </Routes>
    </div>
  )
}

export default App